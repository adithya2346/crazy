import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, CalendarDays, Heart, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/ProductCard";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Aurelia Studio" }, { name: "description", content: "Sign in to track orders and bookings." }, { property: "og:title", content: "My Account — Aurelia Studio" }, { property: "og:description", content: "Track your orders and bookings." }] }),
  component: Account,
});

function Account() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const input = "mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <>
      <PageHero eyebrow="Account" title={mode === "login" ? "Welcome back." : "Create your account."} />
      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-6">
          {mode === "signup" && <label className="block"><span className="text-sm font-medium">Name</span><input className={input} /></label>}
          <label className="block"><span className="text-sm font-medium">Email or mobile</span><input className={input} /></label>
          <label className="block"><span className="text-sm font-medium">Password</span><input type="password" className={input} /></label>
          <button className="btn btn-primary w-full">{mode === "login" ? "Sign in" : "Sign up"}</button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-primary">{mode === "login" ? "Create account" : "Sign in"}</button>
          </p>
        </form>
        <div className="grid grid-cols-2 gap-3">
          {[[Package, "Orders", "/cart"], [CalendarDays, "Bookings", "/book"], [Heart, "Wishlist", "/shop"], [MapPin, "Addresses", "/checkout"]].map(([Icon, l, to]) => {
            const I = Icon as typeof Package;
            return <Link key={l as string} to={to as "/cart"} className="glass flex flex-col justify-between rounded-3xl p-5"><I className="size-6 text-primary" /><span className="mt-6 font-semibold">{l as string}</span></Link>;
          })}
        </div>
      </div>
    </>
  );
}
