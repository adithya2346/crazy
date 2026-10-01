import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Camera, ShoppingBag, ShoppingCart, User, Images } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/data";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/shop", label: "Shop" },
  { to: "/book", label: "Book" },
] as const;

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 glass border-x-0 border-t-0">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-lg text-primary-foreground">A</span>
          <span className="truncate font-display text-xl font-semibold tracking-tight">{BRAND.name}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-primary" activeProps={{ className: "text-primary" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" aria-label="Cart" className="relative hidden size-11 place-items-center rounded-full btn-glass md:grid">
            <ShoppingCart className="size-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{count}</span>}
          </Link>
          <Link to="/book" className="btn btn-glass !min-h-0 !px-4 !py-2 text-primary">Book a shoot</Link>
        </div>
      </div>
    </header>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Camera },
  { to: "/portfolio", label: "Work", icon: Images },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const { count } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 glass border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-6">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link key={to} to={to} className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              {label}
              {to === "/cart" && count > 0 && <span className="absolute right-[22%] top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">{count}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-5 pb-28 md:pb-10">
      <div className="grid gap-8 border-t border-glass-border pt-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold">{BRAND.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">Wedding & event photography, and personalized photo gifts — crafted in {BRAND.city}.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Visit</p>
          <p>{BRAND.address}</p>
          <p className="mt-1">{BRAND.phone}</p>
          <p>{BRAND.email}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Explore</p>
          <Link to="/services" className="hover:text-primary">Photography services</Link>
          <Link to="/shop" className="hover:text-primary">Photo gifts</Link>
          <Link to="/portfolio" className="hover:text-primary">Portfolio</Link>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="hover:text-primary">WhatsApp us</a>
        </div>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">© 2026 {BRAND.name}. All rights reserved.</p>
    </footer>
  );
}

export function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="floaty absolute -left-24 -top-24 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="floaty absolute -right-20 top-40 size-80 rounded-full bg-accent/20 blur-3xl [animation-delay:-3s]" />
    </div>
  );
}
