import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { businessTerms, packagingStandards } from "../data/wholesale.js";
import { useCatalogProducts } from "../lib/useCatalogProducts.js";

const formatInrFromPaise = (paise) => {
  const amount = Number(paise || 0) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const initialForm = {
  businessName: "",
  contactPerson: "",
  email: "",
  cityCountry: "",
  mobile: "",
  avgOrderQty: "",
  message: ""
};

export default function Wholesale() {
  const [formData, setFormData] = useState(initialForm);
  const { products, loading: productsLoading, error: productsError } = useCatalogProducts();

  const tableProducts = [...products].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you! Our wholesale team will reach out within 24-48 hours.");
    setFormData(initialForm);
  };

  return (
    <div className="space-y-16">
      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow">Wholesale Inquiry</p>
            <h1 className="section-title">Let&apos;s build your next best-selling range.</h1>
            <p className="mt-4 text-muted">
              Submit your business details to receive the TENZI catalog, pricing, and production timelines. Our team
              responds within 24-48 hours with a tailored wholesale proposal.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Wholesale Focus</p>
                <p className="mt-2 text-sm text-muted">
                  Leading manufacturer & wholesaler of men&apos;s jeans, pants, and trousers with reliable supply and
                  export-ready packaging.
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Transparent Pricing</p>
                <p className="mt-2 text-sm text-muted">
                  MRP is displayed on the catalog. Bulk order pricing and distributor terms are shared on inquiry.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Business Name</label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="Your company name"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Contact Person</label>
              <input
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">City / Country</label>
              <input
                name="cityCountry"
                value={formData.cityCountry}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="Mumbai, India"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Mobile</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="+91"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">
                Average Order Quantity
              </label>
              <input
                name="avgOrderQty"
                value={formData.avgOrderQty}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="e.g., 200 pcs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                placeholder="Share product requirements or timelines"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Wholesale Inquiry
            </Button>
            <p className="text-xs text-muted">
              By submitting this form, you agree to be contacted by TENZI regarding wholesale opportunities.
            </p>
          </form>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Product Line</p>
          <h2 className="section-title">Signature articles across denim, chinos, and formals.</h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-background">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-[0.3em] text-muted">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Article No.</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Packing</th>
                  <th className="p-4">MRP</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading && (
                  <tr className="border-t border-border">
                    <td className="p-6 text-muted" colSpan={5}>
                      Loading products…
                    </td>
                  </tr>
                )}
                {productsError && (
                  <tr className="border-t border-border">
                    <td className="p-6 text-danger" colSpan={5}>
                      Failed to load products: {productsError.message}
                    </td>
                  </tr>
                )}
                {!productsLoading &&
                  !productsError &&
                  tableProducts.map((product) => (
                    <tr key={product.id} className="border-t border-border">
                      <td className="p-4 font-display text-base">
                        <Link
                          to={`/collections/${product.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="p-4 text-muted">{product.sku || "-"}</td>
                      <td className="p-4 text-muted">{product.description || "-"}</td>
                      <td className="p-4 text-muted">{product.packing || "-"}</td>
                      <td className="p-4 text-primary">
                        {product.displayPrice || formatInrFromPaise(product.price) || "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="glass-card p-6">
            <p className="eyebrow">Packaging & Size Runs</p>
            <h3 className="mt-2 font-display text-2xl">Consistent box standards.</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {packagingStandards.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6">
            <p className="eyebrow">Terms of Business</p>
            <h3 className="mt-2 font-display text-2xl">Reliable policies for partners.</h3>
            <div className="mt-4 space-y-4 text-sm text-muted">
              {businessTerms.map((term) => (
                <div key={term.title}>
                  <p className="font-display text-base text-primary">{term.title}</p>
                  <ul className="mt-2 space-y-2">
                    {term.points.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-3xl border border-primary bg-background p-10 text-center shadow-soft md:flex-row md:text-left">
          <div>
            <p className="eyebrow">Immediate Assistance</p>
            <h2 className="section-title">Need bulk order support today?</h2>
            <p className="mt-3 text-sm text-muted">
              Email tenzijeans@gmail.com or call +91 7982577067 for immediate catalog access.
            </p>
          </div>
          <Button href="mailto:tenzijeans@gmail.com">Email Wholesale Team</Button>
        </div>
      </section>
    </div>
  );
}
