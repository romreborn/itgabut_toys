"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAvailabilityAction } from "./actions";

type Availability = "READY" | "PREORDER" | "SOLD";

const OPTIONS: { value: Availability; label: string; bg: string; fg: string }[] = [
  { value: "READY", label: "Ready", bg: "#DCEBD2", fg: "#3A5A2A" },
  { value: "PREORDER", label: "PO", bg: "#FFE7D6", fg: "#C9490F" },
  { value: "SOLD", label: "Sold", bg: "#EFE6DE", fg: "#8A7263" },
];

/** Inline Ready/PO/Sold switcher so stock status can be flipped from the list, without opening the edit page. */
export default function AvailabilityToggle({ slug, value }: { slug: string; value: Availability }) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {OPTIONS.map((opt) => {
        const active = current === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => {
              if (active || pending) return;
              const prev = current;
              setCurrent(opt.value);
              startTransition(async () => {
                try {
                  await updateAvailabilityAction(slug, opt.value);
                  router.refresh();
                } catch (e) {
                  setCurrent(prev);
                  alert(e instanceof Error ? e.message : "Gagal mengubah status");
                }
              });
            }}
            style={{
              padding: "4px 9px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              border: active ? "2px solid #2E1A10" : "1px solid #EFE6DE",
              background: active ? opt.bg : "#fff",
              color: active ? opt.fg : "#B5A99C",
              cursor: pending ? "default" : "pointer",
              opacity: pending && !active ? 0.5 : 1,
              transition: "opacity .12s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
