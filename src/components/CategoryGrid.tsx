"use client";

import ProductCard from "@/components/ProductCard";
import { decorate } from "@/lib/decorate";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/productShared";

/** Full, unpaginated product grid for /katalog/[seri]: every card is a real link in the server HTML. */
export default function CategoryGrid({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))", gap: 18 }}>
      {products.map((p) => (
        <ProductCard key={p.slug} p={decorate(p, t)} />
      ))}
    </div>
  );
}
