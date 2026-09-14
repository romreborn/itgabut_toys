"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties } from "react";

export interface LightboxImage {
  url: string;
  alt: string;
}

const LightboxContext = createContext<((index: number) => void) | null>(null);

/** Consumed by GalleryImage to open the shared lightbox at a specific index. */
export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) throw new Error("useLightbox must be used within a LightboxProvider");
  return open;
}

/**
 * Scopes a click-to-zoom lightbox (with left/right/swipe navigation) around
 * whatever images are registered in `images`. Wrap a region of the page
 * (e.g. the post body, or just the cover photo) with this, then render each
 * photo through <GalleryImage> with its index into that same array.
 */
export function LightboxProvider({ images, children }: { images: LightboxImage[]; children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, prev, next]);

  const current = index !== null ? images[index] : null;

  return (
    <LightboxContext.Provider value={setIndex}>
      {children}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev() : next());
            touchStartX.current = null;
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(20,12,7,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Tutup"
            style={closeBtnStyle}
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Foto sebelumnya"
                style={navBtnStyle("left")}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Foto berikutnya"
                style={navBtnStyle("right")}
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "min(92vw, 1100px)",
              maxHeight: "88vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt}
              style={{
                maxWidth: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                borderRadius: 12,
                border: "2px solid #fff",
              }}
            />
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "center", opacity: 0.85 }}>
              {current.alt}
              {images.length > 1 && (
                <span style={{ marginLeft: 10, opacity: 0.6 }}>
                  {index! + 1} / {images.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

const closeBtnStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "2px solid #fff",
  background: "rgba(255,255,255,.1)",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

function navBtnStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    [side]: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "2px solid #fff",
    background: "rgba(255,255,255,.1)",
    color: "#fff",
    fontSize: 28,
    lineHeight: 1,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  };
}
