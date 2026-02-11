import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useCatalogProducts } from "../lib/useCatalogProducts.js";

const formatInrFromPaise = (paise) => {
  const amount = Number(paise || 0) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

function normalizeCategory(product) {
  return product.categoryName || product.category || "Uncategorized";
}

export default function Collections() {
  const { products, loading, error } = useCatalogProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(products.map(normalizeCategory));
    return ["all", ...Array.from(unique).filter(Boolean).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || normalizeCategory(product) === category;
      const matchesSearch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div className="space-y-12">
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Product Catalog</p>
          <h1 className="section-title">TENZI wholesale styles, synced from our live catalog.</h1>
          <p className="mt-4 max-w-3xl text-muted">
            Browse verified articles across categories with MRP shown for quick reference. For bulk orders and trade
            terms, connect with our wholesale team.
          </p>

          <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-surface p-6 md:grid-cols-[1.2fr_0.8fr_auto] md:items-end">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Search</label>
              <input
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="Search by name or Article No."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Category</label>
              <select
                className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:pb-1">
              <Button to="/wholesale" className="w-full md:w-auto">
                Request Price List
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Live Products</p>
              <h2 className="section-title">Available articles</h2>
            </div>
            <Button to="/wholesale" variant="outline">
              Become a Partner
            </Button>
          </div>

          {loading && <p className="mt-10 text-muted">Loading catalog…</p>}
          {error && <p className="mt-10 text-danger">Failed to load products: {error.message}</p>}

          {!loading && !error && (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/collections/${product.id}`}
                    className="glass-card group overflow-hidden transition hover:border-primary hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="h-52 w-full bg-surface">
                      <img
                        src={
                          product.mainPhotoURL ||
                          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-charcoal">
                            {normalizeCategory(product)}
                          </p>
                          <h3 className="mt-2 font-display text-xl">{product.name}</h3>
                          <p className="mt-1 text-sm text-muted">Article No.: {product.sku || "-"}</p>
                        </div>
                        {product.packing && (
                          <div className="rounded-2xl border border-border bg-surface px-4 py-2 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">Box</p>
                            <p className="font-display text-base">{product.packing}</p>
                          </div>
                        )}
                      </div>

                      {product.description && (
                        <p className="mt-4 text-sm text-muted">{product.description}</p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                        {product.fit && <span>{product.fit}</span>}
                        {product.fit && product.fabric && <span>•</span>}
                        {product.fabric && <span>{product.fabric}</span>}
                        {(product.fit || product.fabric) && product.wash && <span>•</span>}
                        {product.wash && <span>{product.wash}</span>}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted">MRP</p>
                          <p className="font-display text-lg">
                            {product.displayPrice || formatInrFromPaise(product.price) || "—"}
                          </p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-charcoal group-hover:underline">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {!filtered.length && (
                <div className="mt-10 rounded-3xl border border-border bg-background p-10 text-center">
                  <p className="font-display text-xl">No products found.</p>
                  <p className="mt-2 text-sm text-muted">Try adjusting search or category filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl rounded-3xl border border-primary bg-background p-10 shadow-soft">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">Wholesale Access</p>
              <h2 className="section-title">Request bulk pricing & pack standards.</h2>
              <p className="mt-3 text-sm text-muted">
                Submit your business details to receive wholesale rates, pack ratios, and delivery timelines.
              </p>
            </div>
            <Button to="/wholesale">Contact for Bulk Orders</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
