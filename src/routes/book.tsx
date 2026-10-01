import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, FileText, CreditCard } from "lucide-react";
import { z } from "zod";
import { BRAND, inr, services, packages } from "@/lib/data";
import { unavailableDates, timeSlots } from "@/lib/mock-data";
import { PageHero } from "@/components/site/ProductCard";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): { service?: string } => (typeof s["service"] === "string" ? { service: s["service"] } : {}),
  head: () => ({
    meta: [
      { title: "Book a Photoshoot — Aurelia Studio" },
      { name: "description", content: "Check availability and book wedding, pre-wedding, birthday or family photography." },
      { property: "og:title", content: "Book a Photoshoot — Aurelia Studio" },
      { property: "og:description", content: "Request your date in under a minute." },
    ],
  }),
  component: Book,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")).optional(),
  city: z.string().trim().min(2, "Enter location").max(80),
  notes: z.string().max(500).optional(),
});

type Step = 1 | 2 | 3 | 4 | 5;

function Book() {
  const { service: initial } = Route.useSearch();
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState(initial ?? services[0]!.id);
  const [pkg, setPkg] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const s = services.find((x) => x.id === service)!;
  const selectedPkg = packages.find((p) => p.name === pkg);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    setDone(true);
  };

  if (done) return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <CheckCircle2 className="mx-auto size-12 text-success" />
      <h1 className="mt-4 text-3xl font-semibold">Request received</h1>
      <p className="mt-2 text-muted-foreground">We'll confirm availability for your {s.name.toLowerCase()} on <strong>{selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" }) : "your date"}</strong> within a few hours.</p>
      <a href={`https://wa.me/${BRAND.whatsapp}`} className="btn btn-primary mt-6"><MessageCircle className="size-4" />Chat on WhatsApp</a>
    </div>
  );

  const stepLabels = ["Service", "Date & Time", "Package", "Details", "Confirm"];
  const canAdvance = () => {
    if (step === 1) return !!service;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return true; // package is optional
    return true;
  };

  return (
    <>
      <PageHero eyebrow="Booking" title="Tell us about your day." />

      {/* Step indicator */}
      <div className="mx-auto mt-6 max-w-6xl px-5">
        <div className="no-scrollbar -mx-5 flex gap-0 overflow-x-auto px-5">
          {stepLabels.map((label, i) => {
            const num = (i + 1) as Step;
            const active = step === num;
            const completed = step > num;
            return (
              <button
                key={label}
                onClick={() => num < step && setStep(num)}
                disabled={num > step}
                className={`flex flex-1 shrink-0 flex-col items-center gap-1 py-2 text-center ${active ? "" : completed ? "cursor-pointer" : "opacity-40"}`}
              >
                <div className={`grid size-8 place-items-center rounded-full text-xs font-bold ${active ? "bg-primary text-primary-foreground" : completed ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  {completed ? <CheckCircle2 className="size-4" /> : num}
                </div>
                <span className="text-[10px] font-medium sm:text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-6 px-5 md:grid-cols-[1fr_320px]">
        <div className="glass rounded-3xl p-5 sm:p-6">
          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold">Select a service</h2>
              <p className="mt-1 text-sm text-muted-foreground">What are we shooting?</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {services.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setService(x.id)}
                    className={`overflow-hidden rounded-2xl text-left transition-shadow ${service === x.id ? "ring-2 ring-primary shadow-soft" : "border hover:shadow-soft"}`}
                  >
                    <img src={x.image} alt={x.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    <div className="p-2.5">
                      <p className="text-sm font-semibold">{x.name}</p>
                      <p className="text-xs text-muted-foreground">from {inr(x.from)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold">Pick your date</h2>
              <p className="mt-1 text-sm text-muted-foreground">Red dates are unavailable.</p>
              <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} unavailable={unavailableDates} />

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-semibold">Preferred time</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTime(slot.id)}
                        className={`flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm ${selectedTime === slot.id ? "bg-primary text-primary-foreground" : "border bg-card hover:bg-secondary/30"}`}
                      >
                        <Clock className="size-3.5" /> {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Package */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold">Choose a package</h2>
              <p className="mt-1 text-sm text-muted-foreground">Optional — you can discuss custom packages later.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {packages.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPkg(pkg === p.name ? null : p.name)}
                    className={`rounded-2xl p-5 text-left transition-shadow ${pkg === p.name ? (p.featured ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-soft" : "ring-2 ring-primary shadow-soft glass") : p.featured ? "bg-primary text-primary-foreground" : "glass"}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-lg font-semibold">{p.name}</p>
                      {p.featured && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">Popular</span>}
                    </div>
                    <p className="mt-2 font-display text-2xl font-semibold">{inr(p.price)}</p>
                    <p className={`mt-1 text-xs ${pkg === p.name || p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.note}</p>
                    {pkg === p.name && (
                      <p className="mt-2 flex items-center gap-1 text-xs font-semibold"><CheckCircle2 className="size-3" /> Selected</p>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => setPkg(null)} className="mt-3 text-sm text-muted-foreground hover:text-primary">Skip — I'll discuss later</button>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <form id="booking-form" onSubmit={submit} noValidate>
              <h2 className="text-xl font-semibold">Your details</h2>
              <p className="mt-1 text-sm text-muted-foreground">We'll use this to confirm your booking.</p>
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field name="name" label="Your name" icon={User} error={errors.name} />
                  <Field name="phone" label="Mobile" icon={User} error={errors.phone} inputMode="numeric" autoComplete="tel" />
                </div>
                <Field name="email" label="Email (optional)" icon={User} error={errors.email} type="email" autoComplete="email" />
                <Field name="city" label="Event location / city" icon={MapPin} error={errors.city} />
                <label className="block">
                  <span className="text-sm font-medium">Additional notes</span>
                  <textarea name="notes" rows={3} placeholder="Any special requirements…" className="mt-1 min-h-11 w-full rounded-xl border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
              </div>
            </form>
          )}

          {/* Step 5: Confirm */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold">Confirm your booking</h2>
              <p className="mt-1 text-sm text-muted-foreground">Review everything and submit.</p>
              <div className="mt-4 space-y-3">
                <SummaryRow icon={Calendar} label="Service" value={s.name} />
                {selectedDate && <SummaryRow icon={Calendar} label="Date" value={new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />}
                {selectedTime && <SummaryRow icon={Clock} label="Time" value={timeSlots.find((t) => t.id === selectedTime)?.label || ""} />}
                {selectedPkg && <SummaryRow icon={CreditCard} label="Package" value={`${selectedPkg.name} — ${inr(selectedPkg.price)}`} />}
                <SummaryRow icon={FileText} label="Duration" value={s.duration} />
              </div>
              <div className="mt-5 rounded-xl bg-gold/30 p-3 text-sm text-gold-ink">
                <p className="font-semibold">What happens next?</p>
                <p className="mt-1 text-xs">We'll confirm availability via WhatsApp or call within a few hours. Payment is due upon confirmation.</p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)} className="btn btn-glass"><ChevronLeft className="size-4" /> Back</button>
            ) : <div />}
            {step < 5 ? (
              <button onClick={() => canAdvance() && setStep((step + 1) as Step)} disabled={!canAdvance()} className="btn btn-primary">
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button form="booking-form" type="submit" className="btn btn-primary">Submit booking</button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="glass h-fit overflow-hidden rounded-3xl md:sticky md:top-24">
          <img src={s.image} alt={s.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div className="p-5 space-y-2">
            <p className="font-display text-xl font-semibold">{s.name}</p>
            <p className="text-sm text-muted-foreground">{s.duration} · from {inr(s.from)}</p>
            {selectedDate && (
              <p className="flex items-center gap-1.5 text-sm"><Calendar className="size-3.5 text-primary" /> {new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            )}
            {selectedTime && (
              <p className="flex items-center gap-1.5 text-sm"><Clock className="size-3.5 text-primary" /> {timeSlots.find((t) => t.id === selectedTime)?.label}</p>
            )}
            {selectedPkg && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary"><CreditCard className="size-3.5" /> {selectedPkg.name} · {inr(selectedPkg.price)}</p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

// ─── Mini Calendar ──────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect, unavailable }: { selected: string | null; onSelect: (d: string) => void; unavailable: string[] }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const days = useMemo(() => {
    const { year, month } = viewDate;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay(); // 0=Sun
    const result: (Date | null)[] = Array.from({ length: startDay }, () => null);
    for (let d = 1; d <= last.getDate(); d++) result.push(new Date(year, month, d));
    return result;
  }, [viewDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStr = new Date(viewDate.year, viewDate.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const fmt = (d: Date) => d.toISOString().split("T")[0]!;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setViewDate((v) => { const d = new Date(v.year, v.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="grid size-10 place-items-center rounded-full glass" aria-label="Previous month">
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-semibold">{monthStr}</p>
        <button onClick={() => setViewDate((v) => { const d = new Date(v.year, v.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="grid size-10 place-items-center rounded-full glass" aria-label="Next month">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const iso = fmt(d);
          const isPast = d < today;
          const isUnavailable = unavailable.includes(iso);
          const isSelected = selected === iso;
          const isToday = d.getTime() === today.getTime();
          const disabled = isPast || isUnavailable;

          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={`grid min-h-10 place-items-center rounded-lg text-sm font-medium transition-colors
                ${isSelected ? "bg-primary text-primary-foreground" : ""}
                ${isToday && !isSelected ? "ring-1 ring-primary" : ""}
                ${isUnavailable && !isPast ? "bg-destructive/10 text-destructive line-through" : ""}
                ${isPast ? "text-muted-foreground/30" : ""}
                ${!disabled && !isSelected ? "hover:bg-secondary" : ""}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-primary" /> Selected</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-destructive/30" /> Unavailable</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded-full ring-1 ring-primary" /> Today</span>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────
function Field({ name, label, icon: Icon, error, ...props }: { name: string; label: string; icon: typeof User; error?: string; [k: string]: unknown }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input name={name} {...props} className="mt-1 min-h-11 w-full rounded-xl border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3">
      <Icon className="size-4 text-primary shrink-0" />
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-semibold">{value}</p></div>
    </div>
  );
}
