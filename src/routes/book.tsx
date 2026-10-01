import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { z } from "zod";
import { BRAND, inr, services } from "@/lib/data";
import { PageHero } from "@/components/site/ProductCard";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({ service: typeof s.service === "string" ? s.service : undefined }),
  head: () => ({ meta: [{ title: "Book a Photoshoot — Aurelia Studio" }, { name: "description", content: "Check availability and book wedding, pre-wedding, birthday or family photography." }, { property: "og:title", content: "Book a Photoshoot — Aurelia Studio" }, { property: "og:description", content: "Request your date in under a minute." }] }),
  component: Book,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  date: z.string().min(1, "Pick a date"),
  city: z.string().trim().min(2, "Enter location").max(80),
  notes: z.string().max(500).optional(),
});

function Book() {
  const { service: initial } = Route.useSearch();
  const [service, setService] = useState(initial ?? services[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const s = services.find((x) => x.id === service)!;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({}); setDone(true);
  };

  if (done) return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <CheckCircle2 className="mx-auto size-12 text-success" />
      <h1 className="mt-4 text-3xl font-semibold">Request received</h1>
      <p className="mt-2 text-muted-foreground">We'll confirm availability for your {s.name.toLowerCase()} within a few hours.</p>
      <a href={`https://wa.me/${BRAND.whatsapp}`} className="btn btn-primary mt-6"><MessageCircle className="size-4" />Chat on WhatsApp</a>
    </div>
  );

  const input = "mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const err = (k: string) => errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>;

  return (
    <>
      <PageHero eyebrow="Booking" title="Tell us about your day." />
      <form onSubmit={submit} noValidate className="mx-auto mt-8 grid max-w-6xl gap-6 px-5 md:grid-cols-[1fr_320px]">
        <div className="glass space-y-4 rounded-3xl p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium">Service</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {services.map((x) => <button type="button" key={x.id} onClick={() => setService(x.id)} className={`min-h-11 rounded-xl px-3 text-left text-sm ${service === x.id ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{x.name}</button>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="text-sm font-medium">Your name</span><input name="name" className={input} />{err("name")}</label>
            <label className="block"><span className="text-sm font-medium">Mobile</span><input name="phone" inputMode="numeric" className={input} />{err("phone")}</label>
            <label className="block"><span className="text-sm font-medium">Event date</span><input name="date" type="date" className={input} />{err("date")}</label>
            <label className="block"><span className="text-sm font-medium">City / venue</span><input name="city" className={input} />{err("city")}</label>
          </div>
          <label className="block"><span className="text-sm font-medium">Anything else?</span><textarea name="notes" rows={3} className={input + " py-2"} /></label>
          <button className="btn btn-primary w-full">Request booking</button>
        </div>
        <aside className="glass h-fit overflow-hidden rounded-3xl">
          <img src={s.image} alt={s.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div className="p-5"><p className="font-display text-xl font-semibold">{s.name}</p><p className="text-sm text-muted-foreground">{s.duration} · from {inr(s.from)}</p></div>
        </aside>
      </form>
    </>
  );
}
