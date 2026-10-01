import { Link } from "@tanstack/react-router";
import { Star, Heart, Eye, X } from "lucide-react";
import { useState } from "react";
import { inr, type Product } from "@/lib/data";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ p }: { p: Product }) {
  const { toggle, has } = useWishlist();
  const wishlisted = has(p.id);
  const [showQuick, setShowQuick] = useState(false);

  return (
    <>
      <div className="group glass relative rounded-2xl p-3 shadow-soft sm:p-4">
        <Link to="/product/$id" params={{ id: p.id }} className="block">
          <div className="relative overflow-hidden rounded-xl">
            <img src={p.image} alt={p.name} loading="lazy" width={600} height={600} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {(p.isNew || p.best) && (
              <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-gold-ink">{p.best ? "Best seller" : "New"}</span>
            )}
          </div>
          <div className="mt-3 flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-semibold sm:text-base">{p.name}</p>
            <span className="shrink-0 text-sm font-semibold text-primary">{inr(p.price)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{p.note}</span>
            <span className="flex shrink-0 items-center gap-0.5"><Star className="size-3 fill-accent text-accent" />{p.rating}</span>
          </div>
        </Link>
        {/* Wishlist + Quick View overlay */}
        <div className="absolute right-5 top-5 flex flex-col gap-1.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); toggle(p.id); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="grid size-8 place-items-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-card"
          >
            <Heart className={`size-4 ${wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setShowQuick(true); }}
            aria-label="Quick view"
            className="grid size-8 place-items-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-card"
          >
            <Eye className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      {showQuick && <QuickView p={p} onClose={() => setShowQuick(false)} />}
    </>
  );
}

function QuickView({ p, onClose }: { p: Product; onClose: () => void }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(p.id);
  const [size, setSize] = useState(p.sizes?.[0]);

  const addToCart = () => {
    add({ productId: p.id, name: p.name, image: p.image, price: p.price, size });
    toast.success(`${p.name} added to cart`);
    onClose();
  };

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-card/80 backdrop-blur-sm">
          <X className="size-5" />
        </button>
        <div className="grid sm:grid-cols-2">
          <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
          <div className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-ink">{p.category}</p>
            <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-accent text-accent" />{p.rating} · {p.reviews} reviews
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-primary">{inr(p.price)}</span>
              {p.mrp && <span className="text-sm text-muted-foreground line-through">{inr(p.mrp)}</span>}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>

            {p.sizes && (
              <div className="mt-4">
                <p className="text-xs font-semibold">Size</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${size === s ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-2">
              <button onClick={addToCart} className="btn btn-primary w-full">Add to cart</button>
              <button onClick={() => { toggle(p.id); toast.success(wishlisted ? "Removed" : "Wishlisted"); }} className="btn btn-glass w-full">
                <Heart className={`size-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to wishlist"}
              </button>
            </div>
            <Link to="/product/$id" params={{ id: p.id }} onClick={onClose} className="mt-3 block text-center text-sm font-semibold text-primary">
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHead({ title, sub, link }: { title: string; sub?: string; link?: { to: "/shop" | "/services" | "/portfolio"; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {link && <Link to={link.to} className="shrink-0 text-sm font-semibold text-primary hover:underline">{link.label} →</Link>}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-10 sm:pt-14">
      <span className="glass inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
      <h1 className="rise mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
      {sub && <p className="mt-3 max-w-xl text-muted-foreground">{sub}</p>}
    </section>
  );
}

// ─── Skeleton Loaders ────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-3 sm:p-4">
      <div className="aspect-square w-full rounded-xl bg-muted" />
      <div className="mt-3 flex justify-between gap-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/4 rounded bg-muted" />
      </div>
      <div className="mt-2 flex justify-between gap-2">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-8 rounded bg-muted" />
      </div>
    </div>
  );
}

export function PageHeroSkeleton() {
  return (
    <section className="mx-auto max-w-6xl animate-pulse px-5 pt-10 sm:pt-14">
      <div className="h-6 w-24 rounded-full bg-muted" />
      <div className="mt-4 h-12 w-3/4 rounded-lg bg-muted" />
      <div className="mt-3 h-5 w-1/2 rounded bg-muted" />
    </section>
  );
}

export function TableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass animate-pulse overflow-hidden rounded-2xl">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b px-4 py-3 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-muted" />
          ))}
        </div>
      ))}
    </div>
  );
}
