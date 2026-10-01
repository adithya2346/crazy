import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { key: string; productId: string; name: string; image: string; price: number; qty: number; size?: string; note?: string };

type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = "aurelia-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add: Ctx["add"] = (i, qty = 1) => {
    const key = `${i.productId}|${i.size ?? ""}|${i.note ?? ""}`;
    setItems((prev) => {
      const ex = prev.find((p) => p.key === key);
      if (ex) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...i, key, qty }];
    });
  };
  const setQty = (key: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p)));
  const remove = (key: string) => setItems((prev) => prev.filter((p) => p.key !== key));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
