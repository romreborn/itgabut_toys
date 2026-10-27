# Telegram -> Claude Code agent (Windows runbook)

A Telegram bot that forwards your messages to a headless Claude Code agent running
in a project directory, and streams the reply back. Long polling only, so **no
inbound port, public IP, or domain is needed** — the bot dials out to Telegram.

> **The allowlist is the only thing protecting this machine.** The agent runs bash,
> edits files, and `git push` with no approval prompts. Anyone whose Telegram id is
> in `ALLOWED_TELEGRAM_IDS` can do all of that. Keep that list to yourself, keep the
> bot token secret, and run the service under a dedicated, non-admin user.

## 1. Prerequisites on the server

- **Node.js 20+** and **Git for Windows** (the agent's bash tool needs Git Bash).
- The project you want the agent to work in, cloned and installed (`npm install`),
  with its own `.env` present (e.g. Supabase keys) so scripts work.
- A Claude **Pro / Max / Team / Enterprise** plan (subscription auth needs one).

## 2. Create the subscription token

Install Claude Code and generate a one-year subscription token (needs a browser once,
so do this in the RDP session):

```powershell
npm install -g @anthropic-ai/claude-code
claude setup-token
```

Copy the token it prints. It is NOT saved anywhere, so paste it into `.env` below.

## 3. Create the Telegram bot

- In Telegram, message **@BotFather** -> `/newbot` -> copy the **bot token**.
- Start your bot once, send it `/id`, and note the **user id** it replies with.

## 4. Configure and test

```powershell
cd <this telegram-agent folder>
npm install
copy .env.example .env
notepad .env
```

Fill in `TELEGRAM_BOT_TOKEN`, `ALLOWED_TELEGRAM_IDS` (your user id), `CLAUDE_CODE_OAUTH_TOKEN`,
and `PROJECT_DIR` (absolute path to the project the agent should work in). Then:

```powershell
npm start
```

Message the bot a prompt. You should see it type a streaming reply. `Ctrl+C` to stop.

## 5. Run it 24/7 as a Windows service (NSSM)

Download NSSM (nssm.cc), then, **as the dedicated service user**:

```powershell
nssm install ClaudeTelegramBot "C:\Program Files\nodejs\node.exe" "<path>\telegram-agent\bot.js"
nssm set ClaudeTelegramBot AppDirectory "<path>\telegram-agent"
nssm set ClaudeTelegramBot AppStdout "<path>\telegram-agent\bot.log"
nssm set ClaudeTelegramBot AppStderr "<path>\telegram-agent\bot.log"
nssm start ClaudeTelegramBot
```

The bot reads `.env` next to `bot.js`, so you do not have to set env vars in the
service — but if you prefer service-level env, make sure `ANTHROPIC_API_KEY` is
**absent** (it would override the subscription token). `pm2` + `pm2-startup` also works.

## 6. Security checklist

- `ALLOWED_TELEGRAM_IDS` = only you. Subscription auth is not permitted for other users.
- Bot token and `.env` stay off version control (the `.gitignore` here handles that).
- Run the service as a **dedicated non-admin local user**, not LocalSystem/Administrator.
- Give that user **least-privilege** credentials: a GitHub deploy key scoped to this one
  repo (not your personal account) and a Supabase key you can revoke.
- Set a spend alert in the Anthropic console as a backstop.
- If anything looks wrong, `nssm stop ClaudeTelegramBot` kills it instantly.

## Commands

- `/id` — show your Telegram user id (works for anyone, so you can bootstrap the allowlist).
- `/start`, `/help` — help.
- `/reset` — forget the current session and start a fresh conversation.
- Any other text — a prompt for the agent. Follow-ups continue the same session per chat.

## Notes

- The agent starts **fresh** here — it does not share this project's existing chat
  history or memory. To make it as capable as a full session, add a `CLAUDE.md` in
  `PROJECT_DIR` describing the project's workflow, helpers, and env.
- Sessions are stored in `sessions.json` (one Claude session id per Telegram chat), so
  continuity survives restarts. Delete it to reset everything.
- If the SDK errors on the `allowDangerouslySkipPermissions` option, remove that single
  line in `bot.js` and keep `permissionMode: "bypassPermissions"`.
