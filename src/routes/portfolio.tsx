import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { portfolio, portfolioCats } from "@/lib/data";
import { PageHero } from "@/components/site/ProductCard";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Weddings, Pre-weddings & Portraits | Aurelia Studio" },
      { name: "description", content: "Browse our wedding, pre-wedding, event, portrait and family photography." },
      { property: "og:title", content: "Portfolio — Aurelia Studio" },
      { property: "og:description", content: "Selected weddings, pre-weddings, events and portraits." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = cat === "All" ? portfolio : portfolio.filter((p) => p.cat === cat);

  useEffect(() => {
    if (open === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, list.length]);

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Moments we've kept." />
      <div className="no-scrollbar mx-auto mt-6 flex max-w-6xl gap-2 overflow-x-auto px-5">
        {portfolioCats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium min-h-10 ${cat === c ? "bg-primary text-primary-foreground" : "glass"}`}>{c}</button>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-6xl columns-2 gap-3 px-5 md:columns-3 md:gap-4">
        {list.map((p, i) => (
          <button key={p.id} onClick={() => setOpen(i)} className="group relative mb-3 block w-full overflow-hidden rounded-2xl md:mb-4">
            <img src={p.src} alt={p.title} loading="lazy" width={600} height={p.tall ? 800 : 600} className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.tall ? "aspect-[3/4]" : "aspect-square"}`} />
            <span className="absolute inset-x-2 bottom-2 glass rounded-xl px-3 py-1.5 text-left text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">{p.title}</span>
          </button>
        ))}
      </div>
      {open !== null && list[open] && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 flex flex-col bg-foreground/95 p-4" onClick={() => setOpen(null)}>
          <div className="flex items-center justify-between text-primary-foreground">
            <p className="text-sm">{list[open].title} · {list[open].cat}</p>
            <button aria-label="Close" className="grid size-11 place-items-center"><X /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={list[open].src} alt={list[open].title} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            <button aria-label="Previous" onClick={() => setOpen((open - 1 + list.length) % list.length)} className="absolute left-0 grid size-11 place-items-center rounded-full btn-glass"><ChevronLeft /></button>
            <button aria-label="Next" onClick={() => setOpen((open + 1) % list.length)} className="absolute right-0 grid size-11 place-items-center rounded-full btn-glass"><ChevronRight /></button>
          </div>
        </div>
      )}
    </>
  );
}
