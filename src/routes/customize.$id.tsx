import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Upload, RotateCcw, ZoomIn, ZoomOut, Check, Minus, Plus, ShoppingCart, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { inr, products } from "@/lib/data";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/customize/$id")({
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p || !p.customizable) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Customize — Aurelia Studio" }] };
    return { meta: [{ title: `Customize ${loaderData.p.name} — Aurelia Studio` }, { name: "robots", content: "noindex" }] };
  },
  notFoundComponent: () => <div className="p-10 text-center">Product not found or not customizable. <Link to="/shop" className="text-primary">Back to shop</Link></div>,
  component: CustomizePage,
});

const templates = [
  { id: "classic", name: "Classic", bg: "bg-card" },
  { id: "modern", name: "Modern", bg: "bg-foreground" },
  { id: "vintage", name: "Vintage", bg: "bg-gold" },
  { id: "minimal", name: "Minimal", bg: "bg-secondary" },
];

function CustomizePage() {
  const { p } = Route.useLoaderData();
  const { add } = useCart();

  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [template, setTemplate] = useState(templates[0]!.id);
  const [size, setSize] = useState(p.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const unitPrice = p.price;
  const totalPrice = unitPrice * qty;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhoto(URL.createObjectURL(f));
      setZoom(1);
      setRotation(0);
    }
  };

  const addToCart = () => {
    add({ productId: p.id, name: p.name, image: photo ?? p.image, price: unitPrice, size, note: text || undefined }, qty);
    toast.success(`Customized ${p.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-6 md:pb-8">
      <Link to="/product/$id" params={{ id: p.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Back to {p.name}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Preview area */}
        <div className="glass rounded-3xl p-4 sm:p-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Customize your {p.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload a photo, pick a template and preview before ordering.</p>

          {/* Preview canvas */}
          <div className={`relative mt-5 flex aspect-square items-center justify-center overflow-hidden rounded-2xl ${templates.find((t) => t.id === template)?.bg ?? "bg-card"}`}>
            {photo ? (
              <img
                src={photo}
                alt="Your uploaded photo"
                className="max-h-[85%] max-w-[85%] rounded-lg object-contain shadow-lg transition-transform duration-200"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              />
            ) : (
              <div className="text-center p-8">
                <Upload className="mx-auto size-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">Upload a photo to preview</p>
              </div>
            )}
            {text && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-card/80 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm shadow-sm">
                {text}
              </p>
            )}
          </div>

          {/* Image controls */}
          {photo && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="grid size-10 place-items-center rounded-full glass" aria-label="Zoom out">
                <ZoomOut className="size-4" />
              </button>
              <span className="w-12 text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="grid size-10 place-items-center rounded-full glass" aria-label="Zoom in">
                <ZoomIn className="size-4" />
              </button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="grid size-10 place-items-center rounded-full glass" aria-label="Rotate">
                <RotateCcw className="size-4" />
              </button>
              <button onClick={() => fileRef.current?.click()} className="grid size-10 place-items-center rounded-full glass" aria-label="Replace photo">
                <Upload className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Controls sidebar */}
        <div className="space-y-4">
          {/* Upload */}
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">1. Upload your photo</p>
            <label className="btn btn-glass mt-3 w-full cursor-pointer">
              <Upload className="size-4" /> {photo ? "Replace photo" : "Choose from gallery"}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
            </label>
            {photo && <p className="mt-2 flex items-center gap-1 text-xs text-success"><Check className="size-3" /> Photo uploaded</p>}
          </div>

          {/* Template */}
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">2. Choose a template</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${template === t.id ? "ring-2 ring-primary" : "hover:bg-secondary/50"}`}
                >
                  <div className={`aspect-square w-full rounded-lg ${t.bg} border`} />
                  <span className="text-[10px] font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">3. Add text (optional)</p>
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 40))}
              placeholder="Names, date, or message"
              className="mt-2 min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{text.length}/40</p>
          </div>

          {/* Size */}
          {p.sizes && (
            <div className="glass rounded-2xl p-4">
              <p className="text-sm font-semibold">4. Select size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-h-10 rounded-full px-4 text-sm font-medium ${size === s ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-semibold">5. Quantity</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center rounded-full border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-10 place-items-center" aria-label="Decrease"><Minus className="size-4" /></button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid size-10 place-items-center" aria-label="Increase"><Plus className="size-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground">{inr(unitPrice)} each</p>
            </div>
          </div>

          {/* Price summary */}
          <div className="glass rounded-2xl p-4">
            <div className="flex justify-between text-sm">
              <span>Price ({qty} × {inr(unitPrice)})</span>
              <span className="font-semibold">{inr(totalPrice)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Shipping</span>
              <span className="font-semibold">{totalPrice >= 999 ? "Free" : inr(79)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">{inr(totalPrice + (totalPrice >= 999 ? 0 : 79))}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Estimated delivery: 3–5 working days</p>
          </div>

          {/* Actions */}
          <button onClick={addToCart} className="btn btn-primary w-full">
            <ShoppingCart className="size-4" /> Add to cart · {inr(totalPrice)}
          </button>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-[env(safe-area-inset-bottom)] z-30 glass border-x-0 border-b-0 p-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{qty} item{qty > 1 ? "s" : ""}</p>
            <p className="font-display text-xl font-semibold text-primary">{inr(totalPrice)}</p>
          </div>
          <button onClick={addToCart} className="btn btn-primary">
            <ShoppingCart className="size-4" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
