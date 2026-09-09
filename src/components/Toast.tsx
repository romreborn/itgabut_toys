"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Toast() {
  const { toast } = useCart();
  const { t } = useLanguage();

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 95,
        maxWidth: 330,
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "14px 16px",
        border: "2px solid var(--ink)",
        borderRadius: 18,
        background: "#fff",
        boxShadow: "6px 6px 0 var(--ink)",
        animation: "toastPop .42s cubic-bezier(.2,1.5,.4,1) both",
      }}
      role="status"
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          background: "var(--peach)",
        }}
        aria-hidden
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9490F" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, marginBottom: 2 }}>
          {t.added}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--muted-2)",
            lineHeight: 1.35,
            marginBottom: 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
        <Link
          href="/keranjang"
          style={{
            display: "inline-block",
            padding: "7px 12px",
            border: "2px solid var(--ink)",
            borderRadius: 10,
            background: "var(--yellow)",
            fontSize: 12,
            fontWeight: 800,
            color: "var(--ink)",
          }}
        >
          {t.viewCart} →
        </Link>
      </div>
    </div>
  );
}
