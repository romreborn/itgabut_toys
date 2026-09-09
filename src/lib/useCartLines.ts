import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductsBySlugs, Product } from "@/lib/products";
import { rupiah } from "@/lib/format";

export interface CartLineView {
  slug: string;
  name: string;
  ip: string;
  imageUrl?: string | null;
  price: number;
  isBlind: boolean;
  priceLabel: string;
  qty: string;
  variant: "single" | "set";
  variantLabel: string;
  lineLabel: string;
  lineTotal: number;
}

function num(v: string): number {
  const n = parseInt(v, 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

export function useCartLines() {
  const { cart, patchLine, removeLine } = useCart();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const missing = cart.map((l) => l.slug).filter((s) => !(s in products));
    if (missing.length === 0) return;
    let cancelled = false;
    getProductsBySlugs(missing).then((rows) => {
      if (cancelled) return;
      setProducts((prev) => {
        const next = { ...prev };
        for (const p of rows) next[p.slug] = p;
        // Also record slugs that came back empty so we don't refetch them forever.
        for (const s of missing) if (!next[s]) next[s] = { slug: s } as Product;
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const lines = useMemo<CartLineView[]>(() => {
    return cart.map((l) => {
      const p = products[l.slug] ?? ({
        name: "",
        price: 0,
        ip: "",
        type: "Non Blind Box" as const,
        imageUrl: null,
      } as Product);
      const qty = num(l.qty);
      const variant: "single" | "set" =
        l.variant === "set" && p.type !== "Blind Box" ? "single" : l.variant || "single";
      return {
        slug: l.slug,
        name: p.name,
        ip: p.ip,
        imageUrl: p.imageUrl,
        price: p.price,
        isBlind: p.type === "Blind Box",
        priceLabel: rupiah(p.price),
        qty: l.qty,
        variant,
        variantLabel: variant === "set" ? t.vSet : t.vSingle,
        lineLabel: rupiah(p.price * qty),
        lineTotal: p.price * qty,
      };
    });
  }, [cart, products, t]);

  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const discount = Math.round(subtotal * 0.1);
  const grand = subtotal - discount;
  const cartReady = lines.length > 0 && lines.every((l) => num(l.qty) >= 1 && l.variant);

  return { lines, subtotal, discount, grand, cartReady, patchLine, removeLine };
}
