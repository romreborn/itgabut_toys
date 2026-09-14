"use client";

import ProductImage from "@/components/ProductImage";
import { useLightbox } from "@/components/Lightbox";

/** A photo that opens the enclosing LightboxProvider (zoomed, swipeable) when clicked. */
export default function GalleryImage({
  index,
  name,
  seed,
  imageUrl,
  priority,
}: {
  index: number;
  name: string;
  seed: string;
  imageUrl: string;
  priority?: boolean;
}) {
  const open = useLightbox();
  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`Perbesar foto: ${name}`}
      style={{ display: "block", width: "100%", height: "100%", padding: 0, border: 0, background: "none", cursor: "zoom-in" }}
    >
      <ProductImage name={name} seed={seed} imageUrl={imageUrl} priority={priority} />
    </button>
  );
}
