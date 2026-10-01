import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aurelia Studio" }, { name: "description", content: "Secure checkout for your photo gifts." }, { property: "og:title", content: "Checkout — Aurelia Studio" }, { property: "og:description", content: "Complete your order." }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  email: z.string().trim().email("Enter a valid email").max(120),
  address: z.string().trim().min(8, "Enter full address").max(300),
  pincode: z.string().trim().regex(/^\d{6}$/, "6-digit pincode"),
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const [pay, setPay] = useState("upi");
  const ship = subtotal >= 999 ? 0 : 79;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    // Razorpay integration point: create order server-side, then open Razorpay Checkout here.
    setDone("AU-" + Math.floor(10000 + Math.random() * 89999));
    clear();
  };

  if (done) return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <CheckCircle2 className="mx-auto size-12 text-success" />
      <h1 className="mt-4 text-3xl font-semibold">Order placed</h1>
      <p className="mt-2 text-muted-foreground">Order <b>{done}</b> is confirmed. We'll WhatsApp you a proof before printing.</p>
      <Link to="/shop" className="btn btn-primary mt-6">Continue shopping</Link>
    </div>
  );
  if (!items.length) return <div className="p-16 text-center">Your cart is empty. <Link to="/shop" className="text-primary">Shop now</Link></div>;

  const field = (name: string, label: string, props: Record<string, string> = {}) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input name={name} {...props} className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      {errors[name] && <span className="mt-1 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="mx-auto grid max-w-6xl gap-6 px-5 pt-8 md:grid-cols-[1fr_360px]">
      <div className="glass space-y-4 rounded-3xl p-5 sm:p-6">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        {field("name", "Full name", { autoComplete: "name" })}
        <div className="grid gap-4 sm:grid-cols-2">{field("phone", "Mobile", { inputMode: "numeric", autoComplete: "tel" })}{field("email", "Email", { type: "email", autoComplete: "email" })}</div>
        {field("address", "Delivery address", { autoComplete: "street-address" })}
        {field("pincode", "Pincode", { inputMode: "numeric", autoComplete: "postal-code" })}
        <div>
          <p className="text-sm font-medium">Payment</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[["upi", "UPI"], ["card", "Card"], ["cod", "Cash on delivery"]].map(([v, l]) => (
              <button type="button" key={v} onClick={() => setPay(v!)} className={`min-h-11 rounded-xl px-2 text-xs font-medium ${pay === v ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <aside className="glass h-fit space-y-3 rounded-3xl p-6 md:sticky md:top-24">
        {items.map((i) => <div key={i.key} className="flex justify-between gap-2 text-sm"><span className="truncate">{i.qty} × {i.name}</span><span className="shrink-0">{inr(i.price * i.qty)}</span></div>)}
        <div className="flex justify-between border-t pt-3 text-sm"><span>Shipping</span><span>{ship ? inr(ship) : "Free"}</span></div>
        <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{inr(subtotal + ship)}</span></div>
        <button className="btn btn-primary w-full"><Lock className="size-4" />Pay {inr(subtotal + ship)}</button>
        <p className="text-center text-xs text-muted-foreground">Secure payments via Razorpay</p>
      </aside>
    </form>
  );
}
