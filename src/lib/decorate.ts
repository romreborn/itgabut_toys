import { AVAIL_STYLE, Product } from "@/lib/products";
import { rupiah } from "@/lib/format";
import { waLink } from "@/lib/constants";
import { Dict } from "@/lib/i18n";

export interface DecoratedProduct extends Product {
  priceLabel: string;
  oldLabel: string;
  hasOld: boolean;
  availLabel: string;
  availBg: string;
  availFg: string;
  hasTag: boolean;
  tagLabel: string;
  typeLabel: string;
  isBlind: boolean;
  waOrderLink: string;
  /** Pieces per whole set, parsed from `pack` (e.g. "6PDQ/CTN (1PDQ = 6 PCS)" -> 6). Null when unparseable. */
  setSize: number | null;
  /** "1 Whole Set = 6 pcs" — only meaningful (and only ever shown) for blind box products. */
  setSizeLabel: string;
}

/** Distributor packaging strings all end in "...= N PCS" regardless of PDQ/CTN wording. */
export function parseSetSize(pack: string): number | null {
  const m = pack.match(/=\s*(\d+)\s*PCS/i);
  return m ? parseInt(m[1], 10) : null;
}

export function decorate(p: Product, t: Dict): DecoratedProduct {
  const typeLabel =
    (t.types.find((x) => x[0] === p.type)?.[1] ?? p.type) +
    (p.battery ? " · Battery" : "");
  const setSize = parseSetSize(p.pack);
  return {
    ...p,
    priceLabel: rupiah(p.price),
    oldLabel: p.oldPrice ? rupiah(p.oldPrice) : "",
    hasOld: !!p.oldPrice,
    availLabel: t.avail[p.avail],
    availBg: AVAIL_STYLE[p.avail].bg,
    availFg: AVAIL_STYLE[p.avail].fg,
    hasTag: !!p.tag,
    tagLabel: p.tag ? t.tags[p.tag as keyof typeof t.tags] : "",
    typeLabel,
    isBlind: p.type === "Blind Box",
    waOrderLink: waLink(t.waText + p.name + " (" + rupiah(p.price) + ")"),
    setSize,
    setSizeLabel: setSize ? `1 ${t.vSet} = ${setSize} ${t.qtyUnit}` : "",
  };
}
