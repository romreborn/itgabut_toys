import type { Product } from "@/lib/products";
import { salePrice } from "@/lib/format";

/**
 * Blokees product lines, matched from catalog names. Order matters: the first match wins,
 * so "Champion Class Lite" is checked before plain Champion Class.
 */
const LINES: { name: string; match: RegExp; exclude?: RegExp }[] = [
  { name: "Champion Class Lite", match: /lite/i },
  { name: "Champion Class", match: /champion\s?class|\bcc[-\s]?\d|\(cc\)?\s?\d/i },
  { name: "Galaxy Version", match: /galaxy\s?version|\bgvs?[-\s]?\d|\bgv\)/i, exclude: /shining|wheels/i },
  { name: "Action Edition", match: /action\s?edition|\bae[-\s]?\d|\bae\s-/i },
  { name: "Fantastics", match: /fantastic/i },
  { name: "Shining Version", match: /shining\s?version|\bsv-?\d/i },
  { name: "Galaxy Shining", match: /galaxy\s?shining/i },
  { name: "Hero Infinity", match: /hero\s?infinity/i },
  { name: "DaaLaMode", match: /daalamode/i },
  { name: "Blokees Wheels", match: /wheels/i },
];

export function lineOf(name: string): string | null {
  for (const l of LINES) if (l.match.test(name) && !(l.exclude && l.exclude.test(name))) return l.name;
  return null;
}

export interface LineSummary {
  name: string;
  count: number;
  /** Lowest and highest catalog price after the store-wide discount. */
  min: number;
  max: number;
  format: "blind" | "nonblind" | "mixed";
}

/** Price range and box format per line, computed from the live catalog. */
export function summarizeLines(products: Product[]): LineSummary[] {
  const by = new Map<string, Product[]>();
  for (const p of products) {
    const line = lineOf(p.name);
    if (line) by.set(line, [...(by.get(line) ?? []), p]);
  }
  return LINES.map((l) => l.name)
    .filter((name) => by.has(name))
    .map((name) => {
      const list = by.get(name)!;
      const prices = list.map((p) => salePrice(p.price));
      const blind = list.filter((p) => p.type === "Blind Box").length;
      return {
        name,
        count: list.length,
        min: Math.min(...prices),
        max: Math.max(...prices),
        // A stray mis-tagged item shouldn't flip a whole line to "mixed": 90% or more decides it.
        format: blind / list.length >= 0.9 ? "blind" : blind / list.length <= 0.1 ? "nonblind" : "mixed",
      };
    });
}
