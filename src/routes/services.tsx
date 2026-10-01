import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { inr, services } from "@/lib/data";
import { PageHero } from "@/components/site/ProductCard";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Photography Services & Prices — Aurelia Studio" },
      { name: "description", content: "Wedding, pre-wedding, engagement, birthday, family and event photography with clear starting prices." },
      { property: "og:title", content: "Photography Services — Aurelia Studio" },
      { property: "og:description", content: "Weddings, pre-weddings, birthdays, family and events — see packages and prices." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="Photography for every chapter." sub="Every package can be tailored. Prices are starting points, inclusive of editing and online gallery." />
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} id={s.id} className="glass scroll-mt-24 overflow-hidden rounded-3xl shadow-soft">
            <img src={s.image} alt={s.name} loading="lazy" width={800} height={600} className="aspect-[4/3] w-full object-cover" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-semibold">{s.name}</h2>
                <div className="shrink-0 text-right"><p className="text-xs text-muted-foreground">from</p><p className="font-display text-xl font-semibold text-primary">{inr(s.from)}</p></div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm"><Clock className="size-4 text-gold-ink" />{s.duration}</p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm">
                {s.includes.map((i) => <li key={i} className="flex items-center gap-1.5"><Check className="size-4 shrink-0 text-success" />{i}</li>)}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link to="/portfolio" className="btn btn-glass">View Package</Link>
                <Link to="/book" search={{ service: s.id }} className="btn btn-primary">Book Now</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
