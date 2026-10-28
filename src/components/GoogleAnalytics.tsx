"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

/**
 * Loads GA4 (gtag.js, ~156 KiB) on the visitor's first interaction instead of during page load,
 * so it never competes with first paint and stays out of PageSpeed's "unused JavaScript".
 * Trade-off: visitors who leave without touching, scrolling or typing are not counted in GA4
 * (Vercel Analytics and our own /api/track page views still count them).
 * Client-side navigations happen after an interaction, and GA4's enhanced measurement records
 * them from browser history changes.
 */
export default function GoogleAnalytics({ id }: { id: string }) {
  useEffect(() => {
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag.js expects the Arguments object itself, not an array.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", id);
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, load));
  }, [id]);

  return null;
}
