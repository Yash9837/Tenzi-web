import { Link } from "react-router-dom";
import { useProducts } from "./useProducts.js";
import Button from "../components/Button.jsx";

export default function AdminDashboard() {
  const { stats, loading } = useProducts();

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="section-title">Wholesale catalog overview.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Total Products</p>
          <p className="mt-4 font-display text-3xl">{loading ? "..." : stats.total}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Active Listings</p>
          <p className="mt-4 font-display text-3xl">{loading ? "..." : stats.active}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">No Sizes</p>
          <p className="mt-4 font-display text-3xl">{loading ? "..." : stats.outOfStock}</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Quick Actions</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button to="/admin/products/new">Add Product</Button>
          <Button to="/admin/products" variant="outline">
            View Products
          </Button>
          <Link to="/collections" className="btn btn-outline">
            Preview Website Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
