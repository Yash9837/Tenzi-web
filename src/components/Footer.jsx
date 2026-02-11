import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl tracking-[0.4em]">TENZI</p>
          <p className="mt-3 text-sm text-muted">
            Leading manufacturer & wholesaler of men&apos;s bottoms. Supplying premium denim, cargos, chinos,
            and formal trousers to retail partners across India and global wholesale markets.
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="uppercase tracking-[0.3em] text-xs text-charcoal">Explore</p>
          <Link to="/collections" className="block hover:text-primary">
            Collections
          </Link>
          <Link to="/about" className="block hover:text-primary">
            Production
          </Link>
          <Link to="/wholesale" className="block hover:text-primary">
            Wholesale Inquiry
          </Link>
          <Link to="/admin" className="block hover:text-primary">
            Admin Portal
          </Link>
        </div>
        <div className="space-y-4 text-sm text-muted">
          <p className="uppercase tracking-[0.3em] text-xs text-charcoal">Contact</p>
          <a
            href="https://maps.app.goo.gl/FvL9exPSBBLUHLib8?g_st=iw"
            target="_blank"
            rel="noreferrer"
            className="block hover:text-primary hover:underline"
          >
            6352, Netaji Gali, Gandhi Nagar, Delhi 110031
          </a>
          <a href="tel:+917982577067" className="block hover:text-primary hover:underline">
            +91 7982577067
          </a>
          <a href="mailto:tenzijeans@gmail.com" className="block hover:text-primary hover:underline">
            tenzijeans@gmail.com
          </a>
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Wholesale Markets</p>
          <p>Delhi · Mumbai · Bengaluru · Hyderabad · Pune · Ahmedabad · Kolkata</p>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © 2026 TENZI Wholesale. All rights reserved.
      </div>
    </footer>
  );
}
