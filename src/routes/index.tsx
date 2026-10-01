import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Heart, Truck, Sparkles } from "lucide-react";
import { images, inr, packages, portfolio, products, services, testimonials } from "@/lib/data";
import { ProductCard, SectionHead } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia Studio — Wedding Photography & Personalized Photo Gifts" },
      { name: "description", content: "Jaipur studio for weddings, pre-weddings and events — plus custom photo frames, mugs and albums delivered across India." },
      { property: "og:title", content: "Aurelia Studio — Wedding Photography & Photo Gifts" },
      { property: "og:description", content: "Book a photoshoot or shop personalized frames, mugs and albums." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="grid items-center gap-8 pt-8 md:grid-cols-12 md:pt-16">
        <div className="rise md:col-span-7">
          <span className="glass inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">Weddings · Events · Keepsakes</span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
            Every frame of your <span className="text-primary">big day</span>, made to keep forever.
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">We capture your wedding and events, then turn the best moments into personalized frames, mugs, albums and gifts you can order online.</p>
          <div className="mt-7 grid gap-3 sm:flex">
            <Link to="/book" className="btn btn-primary">Book a Photoshoot</Link>
            <Link to="/shop" className="btn btn-glass">Shop Photo Gifts</Link>
          </div>
          <div className="mt-8 flex gap-8">
            {[["1,200+", "Weddings shot"], ["4.9★", "Client rating"], ["48h", "Preview delivery"]].map(([v, l]) => (
              <div key={l}><p className="font-display text-2xl font-semibold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="glass rounded-3xl p-3 shadow-soft sm:p-4">
            <img src={images.hero} alt="Bride and groom embracing in golden light" width={1024} height={1280} className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <div className="mt-4 flex items-center justify-between px-1">
              <div><p className="font-display text-lg font-semibold">Ananya &amp; Rohan</p><p className="text-xs text-muted-foreground">Udaipur · 2026</p></div>
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-ink">Featured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mt-16 glass rounded-3xl p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-ink">Our studio</p>
        <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">For twelve years we've photographed Rajasthan's most joyful days — and printed them into things you can hold.</p>
      </section>

      {/* Services */}
      <section className="mt-16">
        <SectionHead title="Photography services" sub="Thoughtful coverage for every celebration." link={{ to: "/services", label: "All services" }} />
        <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2">
          {services.slice(0, 5).map((s) => (
            <Link key={s.id} to="/services" hash={s.id} className="glass w-64 shrink-0 snap-start overflow-hidden rounded-2xl shadow-soft">
              <img src={s.image} alt={s.name} loading="lazy" width={600} height={750} className="aspect-[4/5] w-full object-cover" />
              <div className="p-4"><p className="font-semibold">{s.name}</p><p className="text-sm text-muted-foreground">from <span className="font-semibold text-primary">{inr(s.from)}</span></p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mt-16">
        <SectionHead title="Personalized keepsakes" sub="Your photos, printed and delivered to your door." link={{ to: "/shop", label: "Shop all" }} />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Portfolio */}
      <section className="mt-16">
        <SectionHead title="Recent work" link={{ to: "/portfolio", label: "Portfolio" }} />
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          {portfolio.slice(0, 6).map((p) => (
            <img key={p.id} src={p.src} alt={p.title} loading="lazy" width={400} height={500} className="aspect-[4/5] w-full rounded-xl object-cover" />
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="mt-16">
        <SectionHead title="Wedding packages" sub="Transparent pricing. Customise anything." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <div key={p.name} className={`rounded-3xl p-6 ${p.featured ? "bg-primary text-primary-foreground shadow-soft" : "glass"}`}>
              <div className="flex items-baseline justify-between"><p className="font-display text-xl font-semibold">{p.name}</p>{p.featured && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">Most loved</span>}</div>
              <p className="mt-3 font-display text-3xl font-semibold">{inr(p.price)}</p>
              <p className={`mt-2 text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.note}</p>
              <Link to="/book" className={`btn mt-5 w-full ${p.featured ? "bg-primary-foreground text-primary" : "btn-primary"}`}>Book this package</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { n: "01", t: "We shoot", d: "Candid, cinematic coverage of your wedding or event across India.", i: Camera },
          { n: "02", t: "You choose", d: "Pick your favourite photos from the online gallery in 48 hours.", i: Heart },
          { n: "03", t: "We deliver", d: "Frames, mugs, albums and gifts shipped to your doorstep.", i: Truck },
        ].map(({ n, t, d, i: Icon }) => (
          <div key={n} className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-widest text-gold-ink">{n}</span><Icon className="size-5 text-primary" /></div>
            <h3 className="mt-2 text-xl font-semibold">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="mt-16">
        <SectionHead title="Kind words" />
        <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {testimonials.map((t) => (
            <figure key={t.name} className="glass w-80 shrink-0 snap-start rounded-3xl p-6 md:w-auto">
              <blockquote className="font-display text-lg leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-muted-foreground">· {t.place}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground">
          <Sparkles className="size-6 text-accent" />
          <h3 className="mt-3 text-2xl font-semibold">Planning a celebration?</h3>
          <p className="mt-2 text-sm opacity-80">Check availability for your date — we reply within a few hours.</p>
          <Link to="/book" className="btn mt-5 bg-primary-foreground text-primary">Book a Photoshoot</Link>
        </div>
        <div className="glass rounded-3xl p-8">
          <img src={images.frame} alt="" loading="lazy" width={80} height={80} className="size-14 rounded-xl object-cover" />
          <h3 className="mt-3 text-2xl font-semibold">Gift a memory</h3>
          <p className="mt-2 text-sm text-muted-foreground">Upload a photo and we'll craft a frame, mug or album in days.</p>
          <Link to="/shop" className="btn btn-primary mt-5">Shop Photo Gifts</Link>
        </div>
      </section>
    </div>
  );
}
