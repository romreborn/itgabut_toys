import type { Metadata } from "next";

const BRAND = " | ITGabut Toys";
const MAX = 60;

/**
 * Picks the first title option that fits a ~60-character search result. Each option says
 * whether it carries the " | ITGabut Toys" suffix (added by the root layout's title
 * template); options without it are returned as absolute titles so the template stays off.
 * Falls back to the last option when nothing fits.
 */
export function fitTitle(options: { text: string; brand: boolean }[]): { title: Metadata["title"]; text: string } {
  const pick = options.find((o) => o.text.length + (o.brand ? BRAND.length : 0) <= MAX) ?? options[options.length - 1];
  return pick.brand ? { title: pick.text, text: pick.text + BRAND } : { title: { absolute: pick.text }, text: pick.text };
}
