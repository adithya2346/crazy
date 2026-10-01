import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, CalendarDays, Images, Users, Settings, IndianRupee } from "lucide-react";
import { inr, mockBookings, mockOrders, products } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aurelia Studio" }, { name: "description", content: "Studio management dashboard." }, { property: "og:title", content: "Admin — Aurelia Studio" }, { property: "og:description", content: "Studio dashboard." }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const tabs = [
  ["dashboard", "Dashboard", LayoutDashboard], ["products", "Products", Package], ["orders", "Orders", ShoppingCart],
  ["bookings", "Bookings", CalendarDays], ["portfolio", "Portfolio", Images], ["customers", "Customers", Users], ["settings", "Settings", Settings],
] as const;

const badge = (s: string) => ({ Shipped: "bg-secondary text-secondary-foreground", Delivered: "bg-success/15 text-success", Confirmed: "bg-success/15 text-success", Pending: "bg-gold text-gold-ink", Processing: "bg-secondary text-primary" } as Record<string, string>)[s] ?? "bg-muted";

function Admin() {
  const [tab, setTab] = useState<string>("dashboard");
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="glass sticky top-0 z-10 border-y-0 border-l-0 md:h-screen">
        <div className="flex items-center justify-between p-4"><Link to="/" className="font-display text-lg font-semibold">Aurelia Admin</Link></div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {tabs.map(([id, l, I]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm ${tab === id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}><I className="size-4" />{l}</button>
          ))}
        </nav>
      </aside>
      <main className="p-5 sm:p-8">
        <p className="mb-4 rounded-xl bg-gold px-3 py-2 text-xs text-gold-ink">Preview with sample data — sign-in protection activates once the backend is connected.</p>
        {tab === "dashboard" && (
          <>
            <h1 className="text-3xl font-semibold">Good evening</h1>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[["Revenue (Sep)", inr(482300)], ["Orders", "128"], ["Bookings", "17"], ["Customers", "1,904"]].map(([l, v]) => (
                <div key={l} className="glass rounded-2xl p-4"><IndianRupee className="size-4 text-gold-ink" /><p className="mt-3 font-display text-2xl font-semibold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
              ))}
            </div>
            <Table title="Recent orders" rows={mockOrders.map((o) => [o.id, o.customer, o.date, inr(o.total), o.status])} />
            <Table title="Upcoming bookings" rows={mockBookings.map((b) => [b.id, b.customer, b.service, b.date, b.status])} />
          </>
        )}
        {tab === "orders" && <Table title="Orders" rows={mockOrders.map((o) => [o.id, o.customer, o.date, inr(o.total), o.status])} />}
        {tab === "bookings" && <Table title="Bookings" rows={mockBookings.map((b) => [b.id, b.customer, b.service, b.date, b.status])} />}
        {tab === "products" && <Table title="Products" rows={products.map((p) => [p.name, p.category, inr(p.price), `${p.stock} in stock`, p.stock > 20 ? "Confirmed" : "Pending"])} />}
        {["portfolio", "customers", "settings"].includes(tab) && <div className="glass rounded-3xl p-10 text-center text-muted-foreground">This section will be managed here once the backend is connected.</div>}
      </main>
    </div>
  );
}

function Table({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="glass mt-3 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[560px] text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b last:border-0">
                {r.map((c, i) => <td key={i} className="px-4 py-3">{i === r.length - 1 ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(c)}`}>{c}</span> : c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
