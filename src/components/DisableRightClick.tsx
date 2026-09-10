"use client";

import { useEffect } from "react";

/** Blocks the browser's right-click context menu site-wide. */
export default function DisableRightClick() {
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  return null;
}
