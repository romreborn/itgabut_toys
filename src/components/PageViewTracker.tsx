"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Reports each pageview to /api/track.
 *
 * Client-side on purpose: product and blog pages are statically prerendered
 * with ISR, so a server-side counter would tick once per regeneration rather
 * than once per visitor. Running in the browser also means crawlers that
 * don't execute JavaScript stay out of the numbers.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastSent.current) return;
    if (pathname.startsWith("/admin")) return;
    lastSent.current = pathname;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {
      // Telemetry is optional; a failed beacon should never reach the visitor.
    });
  }, [pathname]);

  // Shopee clicks (product "Beli di Shopee", blog affiliate buttons, store links), so the
  // admin can see which products people actually want to buy. One listener catches every
  // Shopee link on the site, including ones rendered from blog JSON.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !/(^|\.)shopee\.co\.id$/.test(a.hostname)) return;
      if (window.location.pathname.startsWith("/admin")) return;
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "shopee", path: window.location.pathname, target: a.href }),
        keepalive: true,
      }).catch(() => {});
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
