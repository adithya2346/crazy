import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/ProductCard";

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
const priceMax = Math.max(...products.map((p) => p.price));
const priceMin = Math.min(...products.map((p) => p.price));

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    let l = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat === "New Arrivals") l = l.filter((p) => p.isNew);
    else if (cat === "Best Sellers") l = l.filter((p) => p.best);
    else if (cat !== "All") l = l.filter((p) => p.category === cat);
    l = l.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [q, cat, sort, priceRange]);

  const activeFilterCount = (cat !== "All" ? 1 : 0) + (priceRange[0] !== priceMin || priceRange[1] !== priceMax ? 1 : 0);

  return (
    <>
      <PageHero eyebrow="Shop" title="Photo gifts, made by hand." />
      <div className="mx-auto mt-6 max-w-6xl px-5">
        {/* Search + Sort + Filter toggle */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`glass relative flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium ${showFilters ? "bg-primary text-primary-foreground" : ""}`}
            aria-label="Filters"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Filter drawer */}
        {showFilters && (
          <div className="glass mt-3 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => { setCat("All"); setPriceRange([priceMin, priceMax]); }} className="text-xs font-medium text-primary">Clear all</button>
            </div>

            {/* Price Range */}
            <div className="mt-4">
              <p className="text-sm font-medium">Price range</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">₹{priceRange[0].toLocaleString("en-IN")}</span>
                <input
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]])}
                  className="flex-1 accent-primary"
                  aria-label="Min price"
                />
                <input
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0])])}
                  className="flex-1 accent-primary"
                  aria-label="Max price"
                />
                <span className="text-sm text-muted-foreground">₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Quick preset price buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["Under ₹1,000", priceMin, 999],
                ["₹1,000 – ₹3,000", 1000, 3000],
                ["₹3,000 – ₹5,000", 3000, 5000],
                ["Above ₹5,000", 5000, priceMax],
              ].map(([label, lo, hi]) => (
                <button
                  key={label as string}
                  onClick={() => setPriceRange([lo as number, hi as number])}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${priceRange[0] === lo && priceRange[1] === hi ? "bg-primary text-primary-foreground" : "border bg-card"}`}
                >
                  {label as string}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category chips */}
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {filters.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium ${cat === c ? "bg-primary text-primary-foreground" : "glass"}`}>{c}</button>
          ))}
        </div>

        {/* Active filters summary */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {cat !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {cat}
                <button onClick={() => setCat("All")} aria-label="Remove filter"><X className="size-3" /></button>
              </span>
            )}
            {(priceRange[0] !== priceMin || priceRange[1] !== priceMax) && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                ₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}
                <button onClick={() => setPriceRange([priceMin, priceMax])} aria-label="Remove filter"><X className="size-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {list.length ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">{list.length} product{list.length !== 1 ? "s" : ""}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </>
        ) : (
          <div className="glass mt-6 rounded-3xl p-10 text-center">
            <p className="text-lg font-semibold">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
            <button onClick={() => { setQ(""); setCat("All"); setPriceRange([priceMin, priceMax]); }} className="btn btn-primary mt-4">Clear all filters</button>
          </div>
        )}
      </div>
    </>
  );
}
