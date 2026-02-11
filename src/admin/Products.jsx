import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { getAvailableSizesLabel, isOutOfStock, useProducts } from "./useProducts.js";
import Button from "../components/Button.jsx";
import { seedStarterProducts } from "./seedStarterProducts.js";
import { useAuth } from "./AuthProvider.jsx";

const stockOptions = [
  { value: "all", label: "All" },
  { value: "in", label: "Available" },
  { value: "out", label: "No Sizes" }
];

const sortOptions = [
  { value: "new", label: "Newest" },
  { value: "old", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" }
];

export default function Products() {
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("new");
  const [undoProduct, setUndoProduct] = useState(null);
  const [seedStatus, setSeedStatus] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.categoryName || product.category));
    return ["all", ...Array.from(unique).filter(Boolean)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.sku?.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryName === categoryFilter ||
        product.category === categoryFilter;

      const outOfStock = isOutOfStock(product);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" && !outOfStock) ||
        (stockFilter === "out" && outOfStock);

      return matchesSearch && matchesCategory && matchesStock;
    });

    result = result.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "old") return (a.updatedAt?.seconds || 0) - (b.updatedAt?.seconds || 0);
      return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0);
    });

    return result;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const handleSoftDelete = async (product) => {
    const confirmDelete = window.confirm(`Archive ${product.name}? You can undo this action.`);
    if (!confirmDelete) return;

    await updateDoc(doc(db, "products", product.id), {
      isActive: false,
      updatedAt: serverTimestamp()
    });
    setUndoProduct(product);
  };

  const handleUndo = async () => {
    if (!undoProduct) return;
    await updateDoc(doc(db, "products", undoProduct.id), {
      isActive: true,
      updatedAt: serverTimestamp()
    });
    setUndoProduct(null);
  };

  const handleSeed = async () => {
    const ok = window.confirm(
      "Seed starter TENZI products into Firestore? Existing Article No. values will be skipped."
    );
    if (!ok) return;

    setSeeding(true);
    setSeedStatus(null);
    try {
      const result = await seedStarterProducts({ createdBy: user?.uid });
      setSeedStatus({
        type: "success",
        text: `Seed complete: ${result.created} created, ${result.skipped} skipped.`
      });
    } catch (err) {
      setSeedStatus({
        type: "danger",
        text: err.message || "Seeding failed."
      });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="text-muted">Loading products...</div>;
  }

  if (error) {
    return <div className="text-danger">Failed to load products: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Product Management</p>
          <h1 className="section-title">Manage the TENZI catalog.</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleSeed} disabled={seeding}>
            {seeding ? "Seeding..." : "Seed Starter Products"}
          </Button>
          <Button to="/admin/products/new">Add Product</Button>
        </div>
      </div>

      {seedStatus && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            seedStatus.type === "success"
              ? "border-success/50 bg-success/10 text-success"
              : "border-danger/50 bg-danger/10 text-danger"
          }`}
        >
          {seedStatus.text}
        </div>
      )}

      <div className="glass-card grid gap-4 p-6 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
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
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-muted">Stock</label>
          <select
            className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
          >
            {stockOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-muted">Sort</label>
          <select
            className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {undoProduct && (
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
          <span className="font-semibold">{undoProduct.name}</span> archived.
          <button
            onClick={handleUndo}
            className="ml-3 text-xs uppercase tracking-[0.3em] text-primary hover:text-charcoal"
          >
            Undo
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {filteredProducts.map((product) => {
          const outOfStock = isOutOfStock(product);
          return (
            <div key={product.id} className="glass-card overflow-hidden">
              <div className="grid gap-4 p-6 sm:grid-cols-[120px_1fr]">
                <img
                  src={
                    product.mainPhotoURL ||
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={product.name}
                  className="h-28 w-full rounded-2xl object-cover"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-charcoal">
                        {product.categoryName || product.category}
                      </p>
                      <h3 className="font-display text-xl">{product.name}</h3>
                      <p className="text-sm text-muted">Article No.: {product.sku || "-"}</p>
                      <p className="text-sm text-muted">Box: {product.packing || "-"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {product.displayPrice || "₹—"}
                      </p>
                      <p
                        className={`text-xs uppercase tracking-[0.3em] ${
                          outOfStock ? "text-danger" : "text-success"
                        }`}
                      >
                        {outOfStock ? "No Sizes" : "Available"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    Available sizes: {getAvailableSizesLabel(product)} · Status: {product.isActive === false ? "Inactive" : "Active"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link to={`/admin/products/${product.id}`} className="btn btn-outline text-xs">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleSoftDelete(product)}
                      className="btn btn-outline text-xs"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!filteredProducts.length && (
        <div className="text-sm text-muted">No products match your filters.</div>
      )}
    </div>
  );
}
