"use server";

import ExcelJS from "exceljs";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface ImportResultRow {
  row: number;
  name: string;
  status: "created" | "updated" | "skipped";
  reason?: string;
}

export interface ImportSummary {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  rows: ImportResultRow[];
}

const EMPTY_SUMMARY: ImportSummary = { total: 0, created: 0, updated: 0, skipped: 0, rows: [] };

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Reads a cell's display text regardless of whether it's plain, rich text, a formula result, or a date. */
function cellText(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    const obj = v as { richText?: { text: string }[]; result?: unknown; text?: unknown };
    if (Array.isArray(obj.richText)) return obj.richText.map((t) => t.text).join("");
    if ("result" in obj) return String(obj.result ?? "");
    if ("text" in obj) return String(obj.text ?? "");
  }
  return String(v);
}

function parsePrice(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  mei: 5,
  may: 5,
  jun: 6,
  jul: 7,
  agu: 8,
  aug: 8,
  sep: 9,
  okt: 10,
  oct: 10,
  nov: 11,
  des: 12,
  dec: 12,
};

function parsePeriodIndex(raw: string): number {
  const m = raw.toLowerCase().match(/[a-z]{3,}/);
  if (!m) return 0;
  const key = m[0].slice(0, 3);
  return MONTHS[key] ?? 0;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findCol(
  headerMap: Record<number, string>,
  keywords: string[],
  exclude: Set<number> = new Set()
): number | null {
  for (const [colStr, header] of Object.entries(headerMap)) {
    const col = Number(colStr);
    if (exclude.has(col)) continue;
    if (keywords.every((k) => header.includes(k))) return col;
  }
  return null;
}

export async function importProductsAction(
  _prevState: ImportSummary,
  formData: FormData
): Promise<ImportSummary> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return {
      ...EMPTY_SUMMARY,
      total: 1,
      skipped: 1,
      rows: [{ row: 0, name: "-", status: "skipped", reason: "Tidak ada file yang diupload." }],
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = new ExcelJS.Workbook();
  try {
    // `Buffer.from(ArrayBuffer)` is a `Buffer` at runtime; the cast is only
    // needed because @types/node's newer generic Buffer<T> doesn't
    // structurally match exceljs's own (older) Buffer type reference.
    await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  } catch (e) {
    return {
      ...EMPTY_SUMMARY,
      total: 1,
      skipped: 1,
      rows: [{ row: 0, name: "-", status: "skipped", reason: `File tidak bisa dibaca: ${(e as Error).message}` }],
    };
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    return {
      ...EMPTY_SUMMARY,
      total: 1,
      skipped: 1,
      rows: [{ row: 0, name: "-", status: "skipped", reason: "Tidak ada sheet di dalam file." }],
    };
  }

  const headerMap: Record<number, string> = {};
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headerMap[colNumber] = normalizeHeader(cellText(cell));
  });

  const colIp = findCol(headerMap, ["ip"]);
  const colCategory = findCol(headerMap, ["category"]);
  const colDescription = findCol(headerMap, ["description"]);
  const colPacking = findCol(headerMap, ["packaging"]);
  const colStockCondition = findCol(headerMap, ["stock", "condition"]);
  const colGlobalLaunching = findCol(headerMap, ["global", "launching"]);
  const colNewPrice = findCol(headerMap, ["new", "retail", "price"]);
  const colOldPrice = findCol(headerMap, ["retail", "price"], new Set(colNewPrice ? [colNewPrice] : []));

  const { data: existingProducts } = await supabaseAdmin.from("products").select("slug,sortOrder");
  const existingSlugs = new Set((existingProducts || []).map((p) => p.slug as string));
  let nextSortOrder = (existingProducts || []).reduce((max, p) => Math.max(max, p.sortOrder as number), 0) + 1;

  const results: ImportResultRow[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const totalRows = worksheet.rowCount;
  for (let rowNumber = 2; rowNumber <= totalRows; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const get = (col: number | null) => (col ? cellText(row.getCell(col)) : "").trim();

    const name = get(colDescription);
    const ip = get(colIp);
    if (!name && !ip) continue; // fully blank row — ignore silently

    if (!name || !ip) {
      results.push({ row: rowNumber, name: name || "(tanpa nama)", status: "skipped", reason: "IP atau Description kosong." });
      skipped++;
      continue;
    }

    const categoryRaw = get(colCategory).toLowerCase();
    const battery = categoryRaw.includes("battery");
    const type: "BLIND_BOX" | "NON_BLIND_BOX" = categoryRaw.includes("nbb") ? "NON_BLIND_BOX" : "BLIND_BOX";

    const stockConditionRaw = get(colStockCondition) || "Ready Stock";
    const availability: "READY" | "PREORDER" | "SOLD" = stockConditionRaw.toLowerCase().includes("ready")
      ? "READY"
      : "PREORDER";

    const pack = get(colPacking);
    const globalLaunching = get(colGlobalLaunching);
    const period = globalLaunching && globalLaunching !== "-" ? globalLaunching : stockConditionRaw;
    const periodIndex = parsePeriodIndex(globalLaunching || stockConditionRaw);

    const newPriceRaw = get(colNewPrice);
    const oldPriceRaw = get(colOldPrice);
    const price = parsePrice(newPriceRaw || oldPriceRaw);
    const oldPrice = parsePrice(oldPriceRaw || newPriceRaw);

    const slug = slugify(`${ip}-${name}`) || slugify(name) || `produk-${rowNumber}`;

    const payload = {
      name,
      ip,
      type,
      battery,
      pack,
      condition: stockConditionRaw,
      period,
      periodIndex,
      availability,
      price,
      oldPrice,
      isActive: true,
    };

    if (existingSlugs.has(slug)) {
      const { error } = await supabaseAdmin.from("products").update(payload).eq("slug", slug);
      if (error) {
        results.push({ row: rowNumber, name, status: "skipped", reason: error.message });
        skipped++;
      } else {
        results.push({ row: rowNumber, name, status: "updated" });
        updated++;
      }
    } else {
      const { error } = await supabaseAdmin
        .from("products")
        .insert({ slug, sortOrder: nextSortOrder, tag: null, year: null, ...payload });
      if (error) {
        results.push({ row: rowNumber, name, status: "skipped", reason: error.message });
        skipped++;
      } else {
        existingSlugs.add(slug);
        nextSortOrder++;
        results.push({ row: rowNumber, name, status: "created" });
        created++;
      }
    }
  }

  if (created > 0 || updated > 0) revalidatePath("/", "layout");

  return { total: results.length, created, updated, skipped, rows: results };
}
