import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button.jsx";

const navLinkClasses = ({ isActive }) =>
  `text-sm uppercase tracking-[0.3em] transition ${
    isActive ? "text-primary" : "text-muted hover:text-primary"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Tenzi Logo" className="h-10 w-10 object-contain" />
          <div>
            <p className="font-display text-lg tracking-[0.4em]">TENZI</p>
          </div>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/collections" className={navLinkClasses}>
            Collections
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            Production
          </NavLink>
          <NavLink to="/wholesale" className={navLinkClasses}>
            Wholesale
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <Button to="/wholesale" variant="outline" className="hidden md:inline-flex">
            Request Price List
          </Button>
          <Button
            to="/wholesale"
            className="!px-3 !py-2 !text-xs md:!px-6 md:!py-3 md:!text-sm"
          >
            Become a Partner
          </Button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.3em] text-muted md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClasses} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/collections" className={navLinkClasses} onClick={() => setOpen(false)}>
              Collections
            </NavLink>
            <NavLink to="/about" className={navLinkClasses} onClick={() => setOpen(false)}>
              Production
            </NavLink>
            <NavLink to="/wholesale" className={navLinkClasses} onClick={() => setOpen(false)}>
              Wholesale
            </NavLink>
            <div className="mt-4 flex flex-col gap-3">
              <Button to="/wholesale" onClick={() => setOpen(false)}>
                Become a Partner
              </Button>
              <Button to="/wholesale" variant="outline" onClick={() => setOpen(false)}>
                Request Price List
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
