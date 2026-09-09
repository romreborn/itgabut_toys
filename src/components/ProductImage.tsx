"use client";

import { useState } from "react";
import Image from "next/image";

const PALETTE = [
  { bg: "#FFE7D6", fg: "#C9490F" },
  { bg: "#DCEBD2", fg: "#3A5A2A" },
  { bg: "#FFF3E9", fg: "#EE6A26" },
  { bg: "#F2E7DC", fg: "#8A7263" },
  { bg: "#FFF7E4", fg: "#B8860B" },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Stand-in photo shown for products that don't have their own photo yet,
 * used in place of the plain "coming soon" tile.
 */
const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/0024/8617/3749/files/BLO-75809-1.jpg?v=1788143885";

interface ProductImageProps {
  name: string;
  seed?: string;
  /** Real product photo URL. Falls back to the default stand-in photo when absent or broken. */
  imageUrl?: string | null;
  className?: string;
  style?: React.CSSProperties;
  /** Skip lazy-loading for above-the-fold images (e.g. the hero). */
  priority?: boolean;
}

/**
 * Product photo with lazy-loading + a shimmering skeleton while it loads,
 * falling back to a stand-in "coming soon" photo when there's no photo yet
 * (or its URL turns out to be broken) — and to a plain placeholder tile if
 * even that stand-in fails to load.
 */
export default function ProductImage({
  name,
  seed,
  imageUrl,
  className,
  style,
  priority,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [defaultErrored, setDefaultErrored] = useState(false);

  const hasRealPhoto = !!imageUrl && !errored;
  const src = hasRealPhoto ? imageUrl! : !defaultErrored ? DEFAULT_IMAGE_URL : null;

  if (src) {
    return (
      <div
        className={className}
        style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
      >
        {!loaded && <div className="img-skeleton" aria-hidden />}
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 300px"
          style={{ objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity .4s ease" }}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => (hasRealPhoto ? setErrored(true) : setDefaultErrored(true))}
        />
        {!hasRealPhoto && <ComingSoonBadge />}
      </div>
    );
  }

  return <PlaceholderTile name={name} seed={seed} className={className} style={style} />;
}

/** Small icon-only "coming soon" corner badge — no text, so it reads the same in any locale. */
function ComingSoonBadge() {
  return (
    <svg
      viewBox="0 0 40 40"
      width={30}
      height={30}
      role="img"
      aria-label="Foto segera hadir"
      style={{ position: "absolute", top: 8, right: 8, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.35))" }}
    >
      <circle cx="20" cy="20" r="17" fill="#fff" stroke="#2E1A10" strokeWidth="2.5" />
      <line x1="20" y1="20" x2="20" y2="11" stroke="#2E1A10" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="20" y1="20" x2="27" y2="20" stroke="#2E1A10" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Photo-less placeholder: a colored "coming soon" tile — a picture-frame
 * icon with a clock badge, built entirely from shapes (no text/font) so it
 * reads the same regardless of locale or font-loading state.
 */
function PlaceholderTile({
  name,
  seed,
  className,
  style,
}: Pick<ProductImageProps, "name" | "seed" | "className" | "style">) {
  const key = seed || name;
  const { bg, fg } = PALETTE[hashStr(key) % PALETTE.length];
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      role="img"
      aria-label={`${name} — foto segera hadir`}
    >
      <rect width="200" height="200" fill={bg} />
      <circle cx="100" cy="93" r="52" fill={fg} opacity="0.1" />

      {/* picture frame */}
      <rect x="55" y="60" width="90" height="66" rx="10" fill="none" stroke={fg} strokeWidth="6" opacity="0.85" />
      <circle cx="80" cy="82" r="7" fill={fg} opacity="0.85" />
      <path d="M62,120 L85,95 L100,110 L118,88 L138,120 Z" fill={fg} opacity="0.85" />

      {/* coming-soon clock badge */}
      <circle cx="144" cy="128" r="21" fill={bg} stroke={fg} strokeWidth="4.5" opacity="0.95" />
      <line x1="144" y1="128" x2="144" y2="115" stroke={fg} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="144" y1="128" x2="154" y2="128" stroke={fg} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
