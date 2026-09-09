"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface CartLine {
  slug: string;
  qty: string;
  variant: "single" | "set";
}

interface CartCtx {
  cart: CartLine[];
  toast: string | null;
  addToCart: (slug: string, name: string) => void;
  patchLine: (slug: string, patch: Partial<CartLine>) => void;
  removeLine: (slug: string) => void;
  clearCart: () => void;
  dismissToast: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "itgabut-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved);
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setCart(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const addToCart = useCallback(
    (slug: string, name: string) => {
      setCart((prev) => {
        const next = prev.some((l) => l.slug === slug)
          ? prev.map((l) =>
              l.slug === slug ? { ...l, qty: String((parseInt(l.qty, 10) || 0) + 1) } : l
            )
          : prev.concat([{ slug, qty: "1", variant: "single" as const }]);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      setToast(name);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    },
    []
  );

  const patchLine = useCallback(
    (slug: string, patch: Partial<CartLine>) => {
      setCart((prev) => {
        const next = prev.map((l) => (l.slug === slug ? { ...l, ...patch } : l));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const removeLine = useCallback((slug: string) => {
    setCart((prev) => {
      const next = prev.filter((l) => l.slug !== slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => persist([]), [persist]);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const value = useMemo(
    () => ({ cart, toast, addToCart, patchLine, removeLine, clearCart, dismissToast }),
    [cart, toast, addToCart, patchLine, removeLine, clearCart, dismissToast]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
