import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Heart, Undo2, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { inr } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Aurelia Studio" },
      { name: "description", content: "Review your personalized photo gifts before checkout." },
      { property: "og:title", content: "Cart — Aurelia Studio" },
      { property: "og:description", content: "Your selected photo gifts." },
    ],
  }),
  component: Cart,
});

const shippingFor = (sub: number) => (sub === 0 || sub >= 999 ? 0 : 79);

function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  const { toggle } = useWishlist();
  const [saved, setSaved] = useState<CartItem[]>([]);
  const ship = shippingFor(subtotal);

  const saveForLater = (item: CartItem) => {
    setSaved((prev) => [...prev, item]);
    remove(item.key);
    toast.success("Saved for later");
  };

  const moveToCart = (item: CartItem) => {
    setSaved((prev) => prev.filter((s) => s.key !== item.key));
    toast.success("Moved back to cart");
  };

  if (!items.length && !saved.length)
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Turn a favourite photo into something to hold.</p>
        <Link to="/shop" className="btn btn-primary mt-6">Shop Photo Gifts</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 pt-8 pb-32 md:grid-cols-[1fr_360px] md:pb-8">
      <div>
        <h1 className="text-3xl font-semibold">Cart</h1>
        {items.length > 0 ? (
          <div className="mt-6 space-y-3">
            {items.map((i) => (
              <div key={i.key} className="glass grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl p-3">
                <img src={i.image} alt={i.name} className="size-[72px] rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/product/$id" params={{ id: i.productId }} className="truncate font-semibold hover:text-primary">{i.name}</Link>
                    <p className="shrink-0 font-semibold text-primary">{inr(i.price * i.qty)}</p>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{[i.size, i.note].filter(Boolean).join(" · ") || "Standard"}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border">
                      <button aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)} className="grid size-9 place-items-center"><Minus className="size-3.5" /></button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)} className="grid size-9 place-items-center"><Plus className="size-3.5" /></button>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => saveForLater(i)} aria-label="Save for later" title="Save for later" className="grid size-9 place-items-center text-muted-foreground hover:text-primary">
                        <Heart className="size-4" />
                      </button>
                      <button onClick={() => { toggle(i.productId); toast.success("Added to wishlist"); }} aria-label="Add to wishlist" className="grid size-9 place-items-center text-muted-foreground hover:text-primary sm:hidden">
                        <Heart className="size-4" />
                      </button>
                      <button aria-label="Remove" onClick={() => remove(i.key)} className="grid size-9 place-items-center text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass mt-6 rounded-3xl p-8 text-center">
            <p className="text-muted-foreground">No items in cart</p>
            <Link to="/shop" className="btn btn-primary mt-3">Continue shopping</Link>
          </div>
        )}

        {/* Saved for later */}
        {saved.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Saved for later</h2>
            <div className="mt-3 space-y-3">
              {saved.map((i) => (
                <div key={i.key} className="glass grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-2xl p-3 opacity-70">
                  <img src={i.image} alt={i.name} className="size-14 rounded-xl object-cover" />
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sm">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{inr(i.price)}</p>
                    </div>
                    <button onClick={() => moveToCart(i)} className="btn btn-glass text-xs py-1.5 px-3">
                      <Undo2 className="size-3.5" /> Move to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free shipping indicator */}
        {items.length > 0 && subtotal < 999 && (
          <div className="glass mt-4 flex items-center gap-2 rounded-xl p-3 text-sm">
            <Truck className="size-4 text-primary shrink-0" />
            <p>Add <span className="font-semibold text-primary">{inr(999 - subtotal)}</span> more for free shipping!</p>
            <div className="ml-auto h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Summary sidebar */}
      {items.length > 0 && (
        <aside className="glass h-fit rounded-3xl p-6 md:sticky md:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className={ship === 0 ? "text-success font-semibold" : ""}>{ship ? inr(ship) : "Free"}</span></div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold"><span>Total</span><span>{inr(subtotal + ship)}</span></div>
          </div>
          <Link to="/checkout" className="btn btn-primary mt-5 w-full">Checkout</Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">Continue shopping</Link>
        </aside>
      )}
    </div>
  );
}
