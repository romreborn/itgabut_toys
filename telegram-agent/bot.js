// Telegram bot that forwards each message to a headless Claude Code agent and
// streams the reply back. Long polling only: it dials OUT to Telegram, so no
// inbound port, public IP, or domain is needed. The ALLOWLIST is the only thing
// standing between a Telegram message and full code execution on this machine.

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { query } from "@anthropic-ai/claude-agent-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// ---- Config ----
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();
const ALLOWED = (process.env.ALLOWED_TELEGRAM_IDS || "")
  .split(",").map((s) => s.trim()).filter(Boolean).map(Number);

if (!TOKEN) { console.error("Missing TELEGRAM_BOT_TOKEN in .env"); process.exit(1); }
if (ALLOWED.length === 0) { console.error("ALLOWED_TELEGRAM_IDS is empty. Refusing to start without an allowlist."); process.exit(1); }

// ---- Auth safety ----
// ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN outrank CLAUDE_CODE_OAUTH_TOKEN. If either
// is set, the subscription token is ignored and you pay per token. Strip them here.
for (const k of ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"]) {
  if (process.env[k]) { console.warn(`[auth] ${k} was set; removing it so the Claude subscription token is used.`); delete process.env[k]; }
}
if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) {
  console.warn("[auth] CLAUDE_CODE_OAUTH_TOKEN is not set. Run `claude setup-token` and put it in .env, or the agent cannot authenticate.");
}

// ---- Session persistence (telegram chat id -> claude session id) ----
const SESS_FILE = path.join(__dirname, "sessions.json");
let sessions = {};
try { sessions = JSON.parse(fs.readFileSync(SESS_FILE, "utf8")); } catch {}
const saveSessions = () => { try { fs.writeFileSync(SESS_FILE, JSON.stringify(sessions)); } catch (e) { console.error("save sessions failed", e); } };

// ---- Telegram ----
const bot = new TelegramBot(TOKEN, { polling: true });
const isAllowed = (id) => ALLOWED.includes(id);
const CHUNK = 3500; // Telegram hard limit is 4096 chars; keep margin.

// A throttled "live" message: edits one Telegram message as text grows, rolls
// over to a new message when it hits the length limit.
function liveStream(chatId) {
  let buffer = "", msgId = null, lastSent = "", timer = null, closed = false;
  async function flush() {
    const text = buffer.trimEnd();
    if (!text || text === lastSent) return;
    try {
      if (msgId == null) {
        const m = await bot.sendMessage(chatId, text.slice(0, CHUNK), { disable_web_page_preview: true });
        msgId = m.message_id; lastSent = text.slice(0, CHUNK);
      } else if (text.length <= CHUNK) {
        await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, disable_web_page_preview: true });
        lastSent = text;
      } else {
        await bot.editMessageText(buffer.slice(0, CHUNK), { chat_id: chatId, message_id: msgId, disable_web_page_preview: true }).catch(() => {});
        buffer = buffer.slice(CHUNK); msgId = null; lastSent = "";
        await flush();
      }
    } catch { /* ignore "message is not modified" and transient edit errors */ }
  }
  return {
    push(t) { buffer += t; if (!timer && !closed) timer = setTimeout(async () => { timer = null; await flush(); }, 1500); },
    async end() { closed = true; if (timer) { clearTimeout(timer); timer = null; } await flush(); },
  };
}

// ---- Run one agent turn for a chat; streams text back; returns updated session id ----
async function runTurn(chatId, prompt) {
  const stream = liveStream(chatId);
  let sessionId = sessions[chatId];
  let gotText = false;
  bot.sendChatAction(chatId, "typing").catch(() => {});
  const typing = setInterval(() => bot.sendChatAction(chatId, "typing").catch(() => {}), 5000);
  try {
    for await (const message of query({
      prompt,
      options: {
        cwd: PROJECT_DIR,
        ...(sessionId ? { resume: sessionId } : {}),
        includePartialMessages: true,
        // FULLY AUTONOMOUS: the agent runs bash, edits files, git push, etc. with no
        // approval prompts. That is the point of the bot, and the reason the allowlist
        // above is the only protection. If the SDK rejects allowDangerouslySkipPermissions,
        // remove that one line and keep permissionMode only.
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
      },
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      } else if (message.type === "stream_event") {
        const e = message.event;
        if (e?.type === "content_block_delta" && e.delta?.type === "text_delta") {
          gotText = true;
          stream.push(e.delta.text);
        }
      } else if (message.type === "result") {
        sessionId = message.session_id;
      }
    }
  } catch (e) {
    console.error("agent error", e);
    await bot.sendMessage(chatId, "⚠️ Agent error: " + String(e?.message || e).slice(0, 300)).catch(() => {});
  } finally {
    clearInterval(typing);
    await stream.end();
  }
  if (sessionId) { sessions[chatId] = sessionId; saveSessions(); }
  if (!gotText) await bot.sendMessage(chatId, "✅ selesai (tanpa teks balasan).").catch(() => {});
}

// ---- Per-chat serial queue: never run two turns on the same session at once ----
const chains = new Map();
function enqueue(chatId, fn) {
  const prev = chains.get(chatId) || Promise.resolve();
  const next = prev.then(fn).catch((e) => console.error("turn failed", e));
  chains.set(chatId, next.finally(() => { if (chains.get(chatId) === next) chains.delete(chatId); }));
  return next;
}

// ---- Handlers ----
// /id answers ANYONE, so you can discover your own id to allowlist yourself. Nothing else does.
bot.onText(/^\/id\b/, (msg) => {
  bot.sendMessage(msg.chat.id, `Telegram user id kamu: ${msg.from.id}\nChat id: ${msg.chat.id}`).catch(() => {});
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  const text = (msg.text || "").trim();
  if (!text || text.startsWith("/id")) return;

  if (!isAllowed(userId)) {
    console.warn(`[blocked] pesan dari user tak berizin ${userId} (@${msg.from?.username || "?"}): ${text.slice(0, 60)}`);
    return; // silent: jangan konfirmasi keberadaan bot ke orang asing
  }

  if (text === "/start" || text === "/help") {
    return void bot.sendMessage(chatId,
      "Claude agent siap. Kirim prompt apa saja, aku kerjakan di project.\n\n" +
      "/reset — mulai percakapan baru (lupakan sesi sebelumnya)\n" +
      "/id — tampilkan user id kamu\n" +
      "/help — bantuan ini"
    ).catch(() => {});
  }
  if (text === "/reset") {
    delete sessions[chatId]; saveSessions();
    return void bot.sendMessage(chatId, "🧹 Sesi di-reset. Pesan berikutnya memulai percakapan baru.").catch(() => {});
  }

  enqueue(chatId, () => runTurn(chatId, text));
});

bot.on("polling_error", (e) => console.error("polling_error", e?.code || e?.message || e));
console.log(`Bot aktif. PROJECT_DIR=${PROJECT_DIR} | allowlist=${ALLOWED.join(", ")}`);
