"use client";

import type { CSSProperties } from "react";

/** A submit button that asks for confirmation before letting its enclosing form submit. */
export default function ConfirmButton({
  children,
  confirmText,
  style,
}: {
  children: React.ReactNode;
  confirmText: string;
  style?: CSSProperties;
}) {
  return (
    <button
      type="submit"
      style={style}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
