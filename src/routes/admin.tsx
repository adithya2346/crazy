import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, CalendarDays, Images, Users, Settings, IndianRupee, Camera,
  Plus, Edit2, Trash2, Eye, EyeOff, Search, ChevronLeft, ChevronRight, Upload, Save, X,
  TrendingUp, Clock, CheckCircle2, Truck, XCircle, AlertCircle, Mail, Phone, MapPin, Globe, Lock
} from "lucide-react";
import { inr, products, services as servicesList, BRAND, images } from "@/lib/data";
import { mockAllOrders, mockAllBookings, mockAdminStats, mockCustomers } from "@/lib/mock-data";
import type { Order, Booking } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aurelia Studio" }, { name: "description", content: "Studio management dashboard." }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Tab = "dashboard" | "products" | "orders" | "bookings" | "services" | "portfolio" | "customers" | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "services", label: "Services", icon: Camera },
  { id: "portfolio", label: "Portfolio", icon: Images },
  { id: "customers", label: "Customers", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Shipped: "bg-secondary text-secondary-foreground", Delivered: "bg-success/15 text-success",
    Confirmed: "bg-success/15 text-success", Pending: "bg-gold text-gold-ink",
    Processing: "bg-secondary text-primary", Completed: "bg-success/15 text-success",
    Cancelled: "bg-destructive/10 text-destructive",
  };
  return map[s] ?? "bg-muted";
};

// ─── Admin Login Gate ───────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="grid size-10 place-items-center rounded-xl bg-primary font-display text-lg text-primary-foreground">A</span>
          <span className="font-display text-2xl font-semibold">Admin</span>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="glass space-y-4 rounded-3xl p-6">
          <h1 className="text-xl font-semibold text-center">Studio login</h1>
          <label className="block"><span className="text-sm font-medium">Email</span><input defaultValue="admin@aureliastudio.in" className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          <label className="block"><span className="text-sm font-medium">Password</span><input type="password" defaultValue="admin123" className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
          <button className="btn btn-primary w-full"><Lock className="size-4" /> Sign in</button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">Demo credentials pre-filled</p>
      </div>
    </div>
  );
}

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="glass sticky top-0 z-10 border-y-0 border-l-0 md:h-screen md:overflow-y-auto">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm text-primary-foreground">A</span>
            <span className="font-display text-lg font-semibold">Admin</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="grid size-9 place-items-center rounded-lg md:hidden" aria-label="Menu">
            {mobileMenuOpen ? <X className="size-5" /> : <LayoutDashboard className="size-5" />}
          </button>
        </div>
        <nav className={`${mobileMenuOpen ? "flex" : "hidden"} gap-1 overflow-x-auto px-3 pb-3 md:flex md:flex-col`}>
          {tabs.map(({ id, label, icon: I }) => (
            <button key={id} onClick={() => { setTab(id); setMobileMenuOpen(false); }} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium ${tab === id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <I className="size-4" />{label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="p-5 sm:p-8 overflow-x-hidden">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "bookings" && <BookingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardTab() {
  const s = mockAdminStats;
  const stats = [
    { label: "Revenue (Sep)", value: inr(s.totalRevenue), icon: IndianRupee, change: "+12%" },
    { label: "Orders", value: s.totalOrders.toString(), icon: ShoppingCart, change: "+8%" },
    { label: "Bookings", value: s.totalBookings.toString(), icon: CalendarDays, change: "+3" },
    { label: "Customers", value: s.totalCustomers.toLocaleString(), icon: Users, change: "+24" },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your studio's performance.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Icon className="size-4 text-gold-ink" />
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-success"><TrendingUp className="size-3" />{change}</span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div className="glass mt-6 rounded-2xl p-5">
        <h2 className="font-semibold">Revenue trend</h2>
        <div className="mt-4 flex h-40 items-end gap-2">
          {s.revenueByMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-primary/80 transition-all" style={{ height: `${(m.amount / 70000) * 100}%` }} />
              <span className="text-[10px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <AdminTable rows={mockAllOrders.slice(0, 5).map((o) => [o.id, o.customerName, new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), inr(o.total), o.status])} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Upcoming bookings</h2>
          <AdminTable rows={mockAllBookings.filter((b) => b.status !== "Completed").slice(0, 5).map((b) => [b.id, b.customerName, b.serviceName, b.date, b.status])} />
        </div>
      </div>
    </>
  );
}

// ─── Products ───────────────────────────────────────────────────────────
function ProductsTab() {
  const [showForm, setShowForm] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-xs"><Plus className="size-4" /> Add product</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="glass mt-4 space-y-3 rounded-2xl p-5">
          <h2 className="font-semibold">New product</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Product name" />
            <AdminField label="Category" type="select" options={["Photo Frames", "Photo Mugs", "Photo Albums", "Personalized Gifts", "Templates"]} />
            <AdminField label="Price (₹)" inputMode="numeric" />
            <AdminField label="MRP (₹)" inputMode="numeric" />
            <AdminField label="Stock" inputMode="numeric" />
            <AdminField label="Sizes (comma-separated)" placeholder="5×7, 8×10, 12×15" />
          </div>
          <AdminField label="Short description" />
          <label className="block">
            <span className="text-xs font-medium">Product image</span>
            <div className="mt-1 flex min-h-20 items-center justify-center rounded-xl border-2 border-dashed bg-card p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary">
              <Upload className="mr-2 size-4" /> Click to upload
            </div>
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Customizable</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> New arrival</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Best seller</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary text-xs"><Save className="size-4" /> Save product</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-glass text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-4 glass flex items-center gap-2 rounded-full px-4 min-h-11">
        <Search className="size-4 text-muted-foreground" />
        <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent text-sm outline-none" />
      </div>

      <div className="glass mt-4 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.image} alt="" className="size-10 rounded-lg object-cover" /><span className="font-medium">{p.name}</span></div></td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-medium">{inr(p.price)}{p.mrp && <span className="ml-1 text-xs text-muted-foreground line-through">{inr(p.mrp)}</span>}</td>
                <td className="px-4 py-3"><span className={p.stock > 20 ? "text-success" : "text-destructive"}>{p.stock}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.stock > 0 ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>{p.stock > 0 ? "Active" : "Out of stock"}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1"><button className="grid size-8 place-items-center rounded-lg hover:bg-secondary" aria-label="Edit"><Edit2 className="size-3.5" /></button><button className="grid size-8 place-items-center rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete"><Trash2 className="size-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Orders ─────────────────────────────────────────────────────────────
function OrdersTab() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? mockAllOrders : mockAllOrders.filter((o) => o.status === filter);

  return (
    <>
      <h1 className="text-3xl font-semibold">Orders</h1>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${filter === s ? "bg-primary text-primary-foreground" : "glass"}`}>
            {s}{s !== "All" && <span className="ml-1 text-xs opacity-60">({mockAllOrders.filter((o) => o.status === s).length})</span>}
          </button>
        ))}
      </div>
      <div className="glass mt-4 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                <td className="px-4 py-3">{o.items.length}</td>
                <td className="px-4 py-3 font-medium">{inr(o.total)}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.paymentStatus === "paid" ? "bg-success/15 text-success" : "bg-gold text-gold-ink"}`}>{o.paymentStatus}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(o.status)}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Bookings ───────────────────────────────────────────────────────────
function BookingsTab() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
  const filtered = filter === "All" ? mockAllBookings : mockAllBookings.filter((b) => b.status === filter);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Bookings</h1>
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`btn text-xs ${view === "list" ? "btn-primary" : "btn-glass"}`}>List</button>
          <button onClick={() => setView("calendar")} className={`btn text-xs ${view === "calendar" ? "btn-primary" : "btn-glass"}`}><CalendarDays className="size-4" /> Calendar</button>
        </div>
      </div>

      {view === "list" ? (
        <>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${filter === s ? "bg-primary text-primary-foreground" : "glass"}`}>
                {s}{s !== "All" && <span className="ml-1 text-xs opacity-60">({mockAllBookings.filter((b) => b.status === s).length})</span>}
              </button>
            ))}
          </div>
          <div className="glass mt-4 overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3">ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium">{b.id}</td>
                    <td className="px-4 py-3">{b.customerName}</td>
                    <td className="px-4 py-3">{b.serviceName}</td>
                    <td className="px-4 py-3">{b.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.timeSlot || "—"}</td>
                    <td className="px-4 py-3 font-medium">{inr(b.amount)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(b.status)}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AdminCalendarView bookings={mockAllBookings} />
      )}
    </>
  );
}

function AdminCalendarView({ bookings }: { bookings: Booking[] }) {
  const [viewDate, setViewDate] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const monthStr = new Date(viewDate.year, viewDate.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const first = new Date(viewDate.year, viewDate.month, 1);
  const last = new Date(viewDate.year, viewDate.month + 1, 0);
  const startDay = first.getDay();
  const days: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: last.getDate() }, (_, i) => i + 1)];

  const getBookingsForDay = (day: number) => {
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => b.date === dateStr);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewDate((v) => { const d = new Date(v.year, v.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="grid size-10 place-items-center rounded-full glass"><ChevronLeft className="size-4" /></button>
        <p className="font-semibold text-lg">{monthStr}</p>
        <button onClick={() => setViewDate((v) => { const d = new Date(v.year, v.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="grid size-10 place-items-center rounded-full glass"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dayBookings = getBookingsForDay(day);
          return (
            <div key={day} className={`glass min-h-20 rounded-xl p-1.5 text-xs ${dayBookings.length ? "ring-1 ring-primary/30" : ""}`}>
              <p className="font-semibold">{day}</p>
              {dayBookings.map((b) => (
                <div key={b.id} className={`mt-0.5 truncate rounded px-1 py-0.5 text-[9px] font-medium ${statusBadge(b.status)}`}>
                  {b.serviceName.split(" ")[0]}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Services ───────────────────────────────────────────────────────────
function ServicesTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Services</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-xs"><Plus className="size-4" /> Add service</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="glass mt-4 space-y-3 rounded-2xl p-5">
          <h2 className="font-semibold">New service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Service name" />
            <AdminField label="Starting price (₹)" inputMode="numeric" />
            <AdminField label="Duration" placeholder="e.g. 1–3 days" />
            <AdminField label="Included features (comma-separated)" placeholder="2 photographers, 500 photos…" />
          </div>
          <AdminField label="Description" />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-glass text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {servicesList.map((s) => (
          <div key={s.id} className="glass rounded-2xl overflow-hidden">
            <img src={s.image} alt={s.name} className="aspect-[3/1] w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.duration} · from {inr(s.from)}</p></div>
                <div className="flex gap-1">
                  <button className="grid size-8 place-items-center rounded-lg hover:bg-secondary" aria-label="Edit"><Edit2 className="size-3.5" /></button>
                  <button className="grid size-8 place-items-center rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.includes.map((inc) => <span key={inc} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{inc}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Portfolio ──────────────────────────────────────────────────────────
function PortfolioTab() {
  const [showUpload, setShowUpload] = useState(false);
  const portfolioItems = [
    { id: 1, title: "Ananya & Rohan · Udaipur", category: "Wedding", image: images.hero },
    { id: 2, title: "Golden hour · Pushkar", category: "Pre-wedding", image: images.prewedding },
    { id: 3, title: "Myra turns 7", category: "Events", image: images.birthday },
    { id: 4, title: "Welcome, baby Aarav", category: "Family", image: images.family },
    { id: 5, title: "Bridal portrait", category: "Portraits", image: images.hero },
    { id: 6, title: "Fields of Amer", category: "Pre-wedding", image: images.prewedding },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Portfolio</h1>
        <button onClick={() => setShowUpload(!showUpload)} className="btn btn-primary text-xs"><Upload className="size-4" /> Upload images</button>
      </div>

      {showUpload && (
        <form onSubmit={(e) => { e.preventDefault(); setShowUpload(false); }} className="glass mt-4 space-y-3 rounded-2xl p-5">
          <h2 className="font-semibold">Upload portfolio images</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Title" placeholder="Couple name · Location" />
            <AdminField label="Category" type="select" options={["Wedding", "Pre-wedding", "Events", "Portraits", "Family", "Other"]} />
          </div>
          <label className="block">
            <span className="text-xs font-medium">Images</span>
            <div className="mt-1 flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed bg-card p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary">
              <Upload className="mr-2 size-5" /> Drag images or click to upload
            </div>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary text-xs"><Save className="size-4" /> Upload</button>
            <button type="button" onClick={() => setShowUpload(false)} className="btn btn-glass text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="glass group relative overflow-hidden rounded-2xl">
            <img src={item.image} alt={item.title} className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
              <p className="text-xs font-semibold text-primary-foreground">{item.title}</p>
              <p className="text-[10px] text-primary-foreground/70">{item.category}</p>
            </div>
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="grid size-8 place-items-center rounded-lg bg-card/80 backdrop-blur-sm" aria-label="Edit"><Edit2 className="size-3.5" /></button>
              <button className="grid size-8 place-items-center rounded-lg bg-card/80 backdrop-blur-sm text-destructive" aria-label="Delete"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Customers ──────────────────────────────────────────────────────────
function CustomersTab() {
  const [searchQ, setSearchQ] = useState("");
  const filtered = mockCustomers.filter((c) => c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.email.includes(searchQ.toLowerCase()));

  return (
    <>
      <h1 className="text-3xl font-semibold">Customers</h1>
      <div className="mt-4 glass flex items-center gap-2 rounded-full px-4 min-h-11">
        <Search className="size-4 text-muted-foreground" />
        <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search by name or email…" className="w-full bg-transparent text-sm outline-none" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</p>

      <div className="glass mt-3 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-3">Customer</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Bookings</th><th className="px-4 py-3">Total spent</th><th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3">{c.orders}</td>
                <td className="px-4 py-3">{c.bookings}</td>
                <td className="px-4 py-3 font-medium">{inr(c.totalSpent)}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Settings ───────────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Settings</h1>

      <div className="mt-6 space-y-6">
        {/* Studio Info */}
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Studio information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Studio name" defaultValue={BRAND.name} />
            <AdminField label="City" defaultValue={BRAND.city} />
            <AdminField label="Full address" defaultValue={BRAND.address} />
            <AdminField label="Tagline" defaultValue="Wedding & event photography, personalized photo gifts" />
          </div>
          <button className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
        </form>

        {/* Contact */}
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Contact details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative"><Mail className="absolute left-3 top-[2.1rem] size-4 text-muted-foreground" /><AdminField label="Email" defaultValue={BRAND.email} className="pl-9" /></div>
            <div className="relative"><Phone className="absolute left-3 top-[2.1rem] size-4 text-muted-foreground" /><AdminField label="Phone" defaultValue={BRAND.phone} className="pl-9" /></div>
            <AdminField label="WhatsApp number" defaultValue={BRAND.whatsapp} />
          </div>
          <button className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
        </form>

        {/* Payment */}
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Payment configuration</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Razorpay Key ID" placeholder="rzp_live_xxxxxxxxxx" />
            <AdminField label="Razorpay Key Secret" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" /> UPI</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" /> Card</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" /> Cash on delivery</label>
          </div>
          <button className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
        </form>

        {/* Delivery */}
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Delivery settings</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Free shipping above (₹)" defaultValue="999" inputMode="numeric" />
            <AdminField label="Default shipping charge (₹)" defaultValue="79" inputMode="numeric" />
            <AdminField label="Estimated delivery days" defaultValue="3–5" />
            <AdminField label="Delivery partner" defaultValue="India Post + DTDC" />
          </div>
          <button className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
        </form>

        {/* Social */}
        <form onSubmit={(e) => e.preventDefault()} className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Social links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Instagram" placeholder="https://instagram.com/aureliastudio" />
            <AdminField label="Facebook" placeholder="https://facebook.com/aureliastudio" />
            <AdminField label="YouTube" placeholder="https://youtube.com/@aureliastudio" />
            <AdminField label="Google Maps" placeholder="https://maps.google.com/..." />
          </div>
          <button className="btn btn-primary text-xs"><Save className="size-4" /> Save</button>
        </form>
      </div>
    </>
  );
}

// ─── Shared ─────────────────────────────────────────────────────────────
function AdminTable({ rows }: { rows: string[][] }) {
  return (
    <div className="glass mt-3 overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[500px] text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b last:border-0 hover:bg-secondary/20">
              {r.map((c, i) => (
                <td key={i} className="px-4 py-3">{i === r.length - 1 ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(c)}`}>{c}</span> : c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminField({ label, type, options, className, ...props }: { label: string; type?: string; options?: string[]; className?: string; [k: string]: unknown }) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      {type === "select" ? (
        <select className={`mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring ${className ?? ""}`} {...props}>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type ?? "text"} className={`mt-1 min-h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring ${className ?? ""}`} {...(props as Record<string, unknown>)} />
      )}
    </label>
  );
}
