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

interface ProductImageProps {
  name: string;
  seed?: string;
  /** Real product photo URL. Falls back to the placeholder tile when absent or broken. */
  imageUrl?: string | null;
  className?: string;
  style?: React.CSSProperties;
  /** Skip lazy-loading for above-the-fold images (e.g. the hero). */
  priority?: boolean;
}

/**
 * Product photo with lazy-loading + a shimmering skeleton while it loads,
 * falling back to a deterministic colored placeholder tile when there's no
 * photo yet (or its URL turns out to be broken).
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

  if (imageUrl && !errored) {
    return (
      <div
        className={className}
        style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
      >
        {!loaded && <div className="img-skeleton" aria-hidden />}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 300px"
          style={{ objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity .4s ease" }}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return <PlaceholderTile name={name} seed={seed} className={className} style={style} />;
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
