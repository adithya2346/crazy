import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, CalendarDays, Heart, MapPin, Settings, LogOut, ChevronRight, Eye, EyeOff, ShoppingBag, Camera, Plus, Trash2, Edit2, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/site/ProductCard";
import { useWishlist } from "@/lib/wishlist";
import { products, inr, BRAND } from "@/lib/data";
import { mockUserOrders, mockUserBookings, mockAddresses } from "@/lib/mock-data";
import type { Order, Booking, Address } from "@/lib/types";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Aurelia Studio" },
      { name: "description", content: "Sign in to track orders and bookings." },
      { property: "og:title", content: "My Account — Aurelia Studio" },
      { property: "og:description", content: "Track your orders and bookings." },
    ],
  }),
  component: Account,
});

type Tab = "login" | "orders" | "bookings" | "wishlist" | "addresses" | "settings";

const isLoggedIn = false; // Mock auth state

function Account() {
  const [tab, setTab] = useState<Tab>(isLoggedIn ? "orders" : "login");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);

  if (tab === "login" && !isLoggedIn) {
    return (
      <>
        <PageHero eyebrow="Account" title={authMode === "login" ? "Welcome back." : authMode === "signup" ? "Create your account." : "Reset password."} />
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-5 md:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-6">
            {authMode === "forgot" ? (
              <>
                <p className="text-sm text-muted-foreground">Enter your email or mobile and we'll send you a link to reset your password.</p>
                <label className="block">
                  <span className="text-sm font-medium">Email or mobile</span>
                  <input className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
                <button className="btn btn-primary w-full">Send reset link</button>
                <p className="text-center text-sm text-muted-foreground">
                  <button type="button" onClick={() => setAuthMode("login")} className="font-semibold text-primary">Back to sign in</button>
                </p>
              </>
            ) : (
              <>
                {authMode === "signup" && (
                  <label className="block">
                    <span className="text-sm font-medium">Full name</span>
                    <input className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" autoComplete="name" />
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-medium">Email or mobile</span>
                  <input className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" autoComplete="email" />
                </label>
                {authMode === "signup" && (
                  <label className="block">
                    <span className="text-sm font-medium">Phone number</span>
                    <input inputMode="numeric" className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" autoComplete="tel" />
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-medium">Password</span>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring" autoComplete={authMode === "login" ? "current-password" : "new-password"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>
                {authMode === "login" && (
                  <p className="text-right">
                    <button type="button" onClick={() => setAuthMode("forgot")} className="text-xs font-medium text-primary">Forgot password?</button>
                  </p>
                )}
                <button className="btn btn-primary w-full">{authMode === "login" ? "Sign in" : "Create account"}</button>
                <p className="text-center text-sm text-muted-foreground">
                  {authMode === "login" ? "New here?" : "Have an account?"}{" "}
                  <button type="button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="font-semibold text-primary">
                    {authMode === "login" ? "Create account" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </form>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: "Orders", desc: "Track your purchases", t: "orders" as Tab },
              { icon: CalendarDays, label: "Bookings", desc: "View photoshoots", t: "bookings" as Tab },
              { icon: Heart, label: "Wishlist", desc: "Saved products", t: "wishlist" as Tab },
              { icon: MapPin, label: "Addresses", desc: "Delivery addresses", t: "addresses" as Tab },
            ].map(({ icon: Icon, label, desc, t }) => (
              <button key={label} onClick={() => setTab(t)} className="glass flex flex-col justify-between rounded-3xl p-5 text-left hover:shadow-soft transition-shadow">
                <Icon className="size-6 text-primary" />
                <div className="mt-6">
                  <span className="font-semibold">{label}</span>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Logged-in view with tabs
  const navItems: { id: Tab; icon: typeof Package; label: string }[] = [
    { id: "orders", icon: Package, label: "Orders" },
    { id: "bookings", icon: CalendarDays, label: "Bookings" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "addresses", icon: MapPin, label: "Addresses" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <PageHero eyebrow="Account" title="Hello, Priya." />
      <div className="mx-auto mt-6 max-w-6xl px-5">
        {/* Tab nav */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${tab === id ? "bg-primary text-primary-foreground" : "glass"}`}
            >
              <Icon className="size-4" />{label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "orders" && <OrdersTab />}
          {tab === "bookings" && <BookingsTab />}
          {tab === "wishlist" && <WishlistTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </>
  );
}

// ─── Orders Tab ─────────────────────────────────────────────────────────
function OrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;

  if (!mockUserOrders.length) return <EmptyState icon={ShoppingBag} title="No orders yet" sub="Your order history will appear here." cta="Shop now" to="/shop" />;

  return (
    <div className="space-y-3">
      {mockUserOrders.map((o) => (
        <button key={o.id} onClick={() => setSelectedOrder(o)} className="glass w-full rounded-2xl p-4 text-left hover:shadow-soft transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{o.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={o.status} />
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {o.items.slice(0, 3).map((item) => (
              <img key={item.id} src={item.image} alt={item.name} className="size-10 rounded-lg object-cover" />
            ))}
            {o.items.length > 3 && <span className="text-xs text-muted-foreground">+{o.items.length - 3}</span>}
            <span className="ml-auto font-semibold text-primary">{inr(o.total)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted-foreground">← Back to orders</button>
      <div className="mt-4 glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{order.id}</h2>
            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Order timeline */}
        <div className="mt-6 flex gap-0">
          {(["Confirmed", "Processing", "Shipped", "Delivered"] as const).map((step, i) => {
            const steps: string[] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
            const current = steps.indexOf(order.status);
            const done = current >= steps.indexOf(step);
            return (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div className={`grid size-8 place-items-center rounded-full text-xs font-bold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <CheckCircle2 className="size-4" /> : i + 1}
                </div>
                <p className={`mt-1 text-[10px] font-medium ${done ? "text-primary" : "text-muted-foreground"}`}>{step}</p>
              </div>
            );
          })}
        </div>

        {order.trackingId && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm">
            <Truck className="size-4 text-primary" /> Tracking: <span className="font-mono font-semibold">{order.trackingId}</span>
          </p>
        )}

        <h3 className="mt-6 font-semibold">Items</h3>
        <div className="mt-2 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3">
              <img src={item.image} alt={item.name} className="size-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{[item.size, item.customText].filter(Boolean).join(" · ") || "Standard"} · Qty {item.qty}</p>
              </div>
              <p className="shrink-0 font-semibold text-primary">{inr(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping ? inr(order.shipping) : "Free"}</span></div>
          <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{inr(order.total)}</span></div>
        </div>

        <h3 className="mt-6 font-semibold">Delivery address</h3>
        <p className="mt-1 text-sm text-muted-foreground">{order.address.name} · {order.address.phone}<br />{order.address.line1}, {order.address.city} {order.address.pincode}</p>
      </div>
    </div>
  );
}

// ─── Bookings Tab ───────────────────────────────────────────────────────
function BookingsTab() {
  if (!mockUserBookings.length) return <EmptyState icon={Camera} title="No bookings yet" sub="Book a photoshoot and it'll appear here." cta="Book a shoot" to="/book" />;

  const upcoming = mockUserBookings.filter((b) => b.status !== "Completed" && b.status !== "Cancelled");
  const past = mockUserBookings.filter((b) => b.status === "Completed" || b.status === "Cancelled");

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <div className="mt-3 space-y-3">
            {upcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Past</h2>
          <div className="mt-3 space-y-3">
            {past.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{booking.serviceName}</p>
          <p className="text-xs text-muted-foreground">{booking.id} · {booking.packageName || "Custom"}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <p className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-primary" /> {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        {booking.timeSlot && <p className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" /> {booking.timeSlot}</p>}
        <p className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" /> {booking.location}</p>
        <p className="font-semibold text-primary">{inr(booking.amount)}</p>
      </div>
      {booking.notes && <p className="mt-2 text-xs text-muted-foreground">"{booking.notes}"</p>}
    </div>
  );
}

// ─── Wishlist Tab ───────────────────────────────────────────────────────
function WishlistTab() {
  const { items: wishIds, toggle } = useWishlist();
  const wishProducts = products.filter((p) => wishIds.includes(p.id));

  if (!wishProducts.length) return <EmptyState icon={Heart} title="Your wishlist is empty" sub="Tap the heart on any product to save it here." cta="Browse shop" to="/shop" />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {wishProducts.map((p) => (
        <div key={p.id} className="glass rounded-2xl p-3 sm:p-4">
          <Link to="/product/$id" params={{ id: p.id }} className="block">
            <img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
            <p className="text-sm font-semibold text-primary">{inr(p.price)}</p>
          </Link>
          <button onClick={() => toggle(p.id)} className="btn btn-glass mt-2 w-full text-xs">
            <Trash2 className="size-3.5" /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Addresses Tab ──────────────────────────────────────────────────────
function AddressesTab() {
  const [addresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-glass text-xs"><Plus className="size-3.5" /> Add new</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="glass space-y-3 rounded-2xl p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-xs font-medium">Label</span><input placeholder="Home, Office…" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">Name</span><input className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">Phone</span><input inputMode="numeric" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">Pincode</span><input inputMode="numeric" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          </div>
          <label className="block"><span className="text-xs font-medium">Address</span><input className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-xs font-medium">City</span><input className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">State</span><input className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary text-xs">Save address</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-glass text-xs">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" sub="Add an address for faster checkout." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className={`glass rounded-2xl p-4 ${a.isDefault ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{a.label}</span>
                <div className="flex gap-1">
                  {a.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>}
                  <button aria-label="Edit" className="grid size-8 place-items-center rounded-full hover:bg-secondary"><Edit2 className="size-3.5" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.line1}</p>
              <p className="text-sm text-muted-foreground">{a.city}, {a.state} {a.pincode}</p>
              <p className="text-sm text-muted-foreground">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ───────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-xs font-medium">Name</span><input defaultValue="Priya Sharma" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">Email</span><input defaultValue="priya@email.com" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block"><span className="text-xs font-medium">Phone</span><input defaultValue="9876543210" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          </div>
          <button className="btn btn-primary text-xs">Save changes</button>
        </form>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-3">
          <label className="block"><span className="text-xs font-medium">Current password</span><input type="password" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          <label className="block"><span className="text-xs font-medium">New password</span><input type="password" className="mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          <button className="btn btn-primary text-xs">Update password</button>
        </form>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Contact studio</h2>
        <p className="mt-2 text-sm text-muted-foreground">{BRAND.phone} · {BRAND.email}</p>
        <a href={`https://wa.me/${BRAND.whatsapp}`} className="btn btn-glass mt-3 text-xs">Chat on WhatsApp</a>
      </div>

      <button className="btn btn-glass w-full text-destructive">
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}

// ─── Shared Components ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; icon: typeof CheckCircle2 }> = {
    Pending: { bg: "bg-gold text-gold-ink", icon: Clock },
    Confirmed: { bg: "bg-success/15 text-success", icon: CheckCircle2 },
    Processing: { bg: "bg-secondary text-primary", icon: Package },
    Shipped: { bg: "bg-secondary text-secondary-foreground", icon: Truck },
    Delivered: { bg: "bg-success/15 text-success", icon: CheckCircle2 },
    Completed: { bg: "bg-success/15 text-success", icon: CheckCircle2 },
    Cancelled: { bg: "bg-destructive/10 text-destructive", icon: XCircle },
  };
  const m = map[status] ?? { bg: "bg-muted", icon: AlertCircle };
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.bg}`}>
      <Icon className="size-3" />{status}
    </span>
  );
}

function EmptyState({ icon: Icon, title, sub, cta, to }: { icon: typeof Package; title: string; sub: string; cta?: string; to?: string }) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <Icon className="mx-auto size-10 text-muted-foreground/40" />
      <p className="mt-4 text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      {cta && to && <Link to={to as "/"} className="btn btn-primary mt-5">{cta}</Link>}
    </div>
  );
}
