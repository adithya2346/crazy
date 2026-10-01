import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, products } from "@/lib/data";
import { PageHero, ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Photo Frames, Mugs & Albums — Aurelia Studio" },
      { name: "description", content: "Personalized photo frames, mugs, albums and gifts printed in our studio and delivered across India." },
      { property: "og:title", content: "Shop Personalized Photo Gifts — Aurelia Studio" },
      { property: "og:description", content: "Custom frames, mugs, albums and gifts from your photos." },
    ],
  }),
  component: Shop,
});

const filters = ["All", ...categories, "New Arrivals", "Best Sellers"];

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    let l = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat === "New Arrivals") l = l.filter((p) => p.isNew);
    else if (cat === "Best Sellers") l = l.filter((p) => p.best);
    else if (cat !== "All") l = l.filter((p) => p.category === cat);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [q, cat, sort]);

  return (
    <>
      <PageHero eyebrow="Shop" title="Photo gifts, made by hand." />
      <div className="mx-auto mt-6 max-w-6xl px-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <label className="glass flex min-h-11 items-center gap-2 rounded-full px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search frames, mugs…" className="w-full min-w-0 bg-transparent text-sm outline-none" />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="glass min-h-11 rounded-full px-3 text-sm" aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="low">Price ↑</option>
            <option value="high">Price ↓</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {filters.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium ${cat === c ? "bg-primary text-primary-foreground" : "glass"}`}>{c}</button>
          ))}
        </div>
        {list.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="glass mt-6 rounded-3xl p-10 text-center text-muted-foreground">No products match your search.</div>
        )}
      </div>
    </>
  );
}
