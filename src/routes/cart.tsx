import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Aurelia Studio" }, { name: "description", content: "Review your personalized photo gifts before checkout." }, { property: "og:title", content: "Cart — Aurelia Studio" }, { property: "og:description", content: "Your selected photo gifts." }] }),
  component: Cart,
});

export const shippingFor = (sub: number) => (sub === 0 || sub >= 999 ? 0 : 79);

function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  const ship = shippingFor(subtotal);
  if (!items.length)
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Turn a favourite photo into something to hold.</p>
        <Link to="/shop" className="btn btn-primary mt-6">Shop Photo Gifts</Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 pt-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-3xl font-semibold">Cart</h1>
        <div className="mt-6 space-y-3">
          {items.map((i) => (
            <div key={i.key} className="glass grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl p-3">
              <img src={i.image} alt={i.name} className="size-[72px] rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2"><p className="truncate font-semibold">{i.name}</p><p className="shrink-0 font-semibold text-primary">{inr(i.price * i.qty)}</p></div>
                <p className="truncate text-xs text-muted-foreground">{[i.size, i.note].filter(Boolean).join(" · ") || "Standard"}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border">
                    <button aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)} className="grid size-9 place-items-center"><Minus className="size-3.5" /></button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)} className="grid size-9 place-items-center"><Plus className="size-3.5" /></button>
                  </div>
                  <button aria-label="Remove" onClick={() => remove(i.key)} className="grid size-9 place-items-center text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="glass h-fit rounded-3xl p-6 md:sticky md:top-24">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{ship ? inr(ship) : "Free"}</span></div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold"><span>Total</span><span>{inr(subtotal + ship)}</span></div>
        </div>
        <Link to="/checkout" className="btn btn-primary mt-5 w-full">Checkout</Link>
      </aside>
    </div>
  );
}
