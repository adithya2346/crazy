import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr, type Product } from "@/lib/data";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/product/$id" params={{ id: p.id }} className="group glass rounded-2xl p-3 shadow-soft transition-transform active:scale-[0.98] sm:p-4">
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
