import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Star, Upload, Truck, ShieldCheck, Heart, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { inr, products } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { mockReviews } from "@/lib/mock-data";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.p.name} — Aurelia Studio`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.p.note }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.p.note }] };
  },
  notFoundComponent: () => <div className="p-10 text-center">Product not found. <Link to="/shop" className="text-primary">Back to shop</Link></div>,
  component: ProductPage,
});

function ProductPage() {
  const { p } = Route.useLoaderData();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(p.id);
  const nav = useNavigate();
  const [size, setSize] = useState(p.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const reviews = mockReviews.filter((r) => r.productId === p.id);
  const allImages = [p.image]; // In production, this would be p.images[]

  const addToCart = (go?: boolean) => {
    add({ productId: p.id, name: p.name, image: photo ?? p.image, price: p.price, size, note: text || undefined }, qty);
    toast.success(`${p.name} added to cart`);
    if (go) nav({ to: "/cart" });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-32 md:pb-8">
      <Link to="/shop" className="text-sm text-muted-foreground">← Shop</Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="glass relative overflow-hidden rounded-3xl p-3">
            <img src={allImages[activeImg]} alt={p.name} width={800} height={800} className="aspect-square w-full rounded-2xl object-cover" />
            {photo && <img src={photo} alt="Your upload preview" className="absolute bottom-6 right-6 size-24 rounded-xl border-4 border-card object-cover shadow-soft" />}
            {allImages.length > 1 && (
              <>
                <button onClick={() => setActiveImg((activeImg - 1 + allImages.length) % allImages.length)} className="absolute left-5 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full glass" aria-label="Previous"><ChevronLeft className="size-5" /></button>
                <button onClick={() => setActiveImg((activeImg + 1) % allImages.length)} className="absolute right-5 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full glass" aria-label="Next"><ChevronRight className="size-5" /></button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`size-16 overflow-hidden rounded-xl ${activeImg === i ? "ring-2 ring-primary" : "opacity-60"}`}>
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-ink">{p.category}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{p.name}</h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><Star className="size-4 fill-accent text-accent" />{p.rating} · {p.reviews} reviews</p>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-primary">{inr(p.price)}</span>
            {p.mrp && <span className="text-muted-foreground line-through">{inr(p.mrp)}</span>}
            {p.mrp && <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">{Math.round((1 - p.price / p.mrp) * 100)}% off</span>}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · {p.stock > 20 ? "In stock" : `Only ${p.stock} left`}</p>

          <p className="mt-4 text-sm text-muted-foreground">{p.note}</p>

          {p.sizes && (
            <div className="mt-6">
              <p className="text-sm font-semibold">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`min-h-11 rounded-full px-4 text-sm ${size === s ? "bg-primary text-primary-foreground" : "glass"}`}>{s}</button>)}
              </div>
            </div>
          )}

          {p.customizable && (
            <div className="glass mt-6 space-y-3 rounded-2xl p-4">
              <p className="text-sm font-semibold">Personalize</p>
              <label className="btn btn-glass w-full cursor-pointer">
                <Upload className="size-4" /> {photo ? "Change photo" : "Upload your photo"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
              </label>
              <input value={text} onChange={(e) => setText(e.target.value.slice(0, 40))} placeholder="Names or date to print (optional)" className="min-h-11 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <Link to="/customize/$id" params={{ id: p.id }} className="btn btn-glass w-full text-primary">
                <Palette className="size-4" /> Open full customizer
              </Link>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="glass flex items-center rounded-full">
              <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-11 place-items-center"><Minus className="size-4" /></button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty(qty + 1)} className="grid size-11 place-items-center"><Plus className="size-4" /></button>
            </div>
            <button onClick={() => addToCart()} className="btn btn-glass flex-1">Add to cart</button>
            <button
              onClick={() => { toggle(p.id); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="grid size-11 place-items-center rounded-full glass"
            >
              <Heart className={`size-5 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>
          <button onClick={() => addToCart(true)} className="btn btn-primary mt-3 w-full">Buy now · {inr(p.price * qty)}</button>

          <div className="mt-6 grid gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Truck className="size-4 text-primary" />Free delivery over ₹999 · ships in 3–5 days</p>
            <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Free reprint if anything arrives damaged</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Customer reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`size-5 ${n <= Math.round(p.rating) ? "fill-accent text-accent" : "text-muted"}`} />)}
            </div>
            <p className="text-sm text-muted-foreground">{p.rating} out of 5 · {p.reviews} reviews</p>
          </div>
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{r.userName}</p>
                  <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`size-3 ${n <= r.rating ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.filter((x) => x.id !== p.id).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 glass border-x-0 border-b-0 p-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-primary">{inr(p.price * qty)}</p>
          </div>
          <button onClick={() => addToCart()} className="btn btn-glass text-sm py-2 px-4">Add to cart</button>
          <button onClick={() => addToCart(true)} className="btn btn-primary text-sm py-2 px-4">Buy now</button>
        </div>
      </div>
    </div>
  );
}
