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

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
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

/** Photo-less placeholder: a colored tile with the product's initials. */
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
      aria-label={name}
    >
      <rect width="200" height="200" fill={bg} />
      <circle cx="100" cy="86" r="46" fill={fg} opacity="0.14" />
      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Baloo 2', cursive"
        fontWeight="800"
        fontSize="46"
        fill={fg}
      >
        {initials(name)}
      </text>
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill={fg}
        opacity="0.75"
      >
        FOTO SEGERA
      </text>
    </svg>
  );
}
