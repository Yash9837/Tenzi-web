import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

const navClasses = ({ isActive }) =>
  `rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.3em] transition ${
    isActive ? "bg-background text-charcoal" : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/admin";

  if (!user || isLoginRoute) {
    return (
      <div className="min-h-screen bg-surface text-primary">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl bg-charcoal p-6 text-white shadow-card md:sticky md:top-8">
          <div>
            <p className="font-display text-lg tracking-[0.35em]">TENZI</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Admin Portal</p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            <NavLink to="/admin/dashboard" className={navClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navClasses}>
              Products
            </NavLink>
            <NavLink to="/admin/products/new" className={navClasses}>
              Add Product
            </NavLink>
          </nav>

          <div className="mt-8 border-t border-white/15 pt-6">
            <button
              type="button"
              onClick={() => signOut()}
              className="btn w-full border border-white/40 bg-transparent text-white hover:bg-background hover:text-charcoal"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
