import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type WishlistCtx = {
  items: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  count: number;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "aurelia-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const toggle = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = useCallback((id: string) => items.includes(id), [items]);

  return (
    <Ctx.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
