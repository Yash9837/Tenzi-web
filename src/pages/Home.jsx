import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import { categories, featuredProducts, testimonials } from "../data/catalog.js";
import { useCatalogProducts } from "../lib/useCatalogProducts.js";

const trustBadges = [
  "100% Secure Transactions",
  "Premium Quality Assurance",
  "Leading Manufacturer",
  "Trusted by Retailers Nationwide"
];

const valueProps = [
  {
    title: "Reliable Wholesale Supply",
    description:
      "Consistent production cycles, seasonal drops, and inventory planning tailored for B2B partners."
  },
  {
    title: "Retail-Ready Branding",
    description:
      "Signature TENZI leather-style back patches and precision trims to elevate in-store merchandising."
  },
  {
    title: "Flexible Order Quantities",
    description:
      "Smart pack ratios and adjustable MOQs to match your market demand."
  }
];

export default function Home() {
  const { products: liveProducts } = useCatalogProducts();
  const featured = liveProducts.length ? liveProducts.slice(0, 4) : featuredProducts;
  const [heroAspectRatio, setHeroAspectRatio] = useState("3 / 4");

  const formatInrFromPaise = (paise) => {
    const amount = Number(paise || 0) / 100;
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const minPriceByCategory = useMemo(() => {
    const map = new Map();
    for (const product of liveProducts) {
      const key = product.category;
      const price = Number(product.price || 0);
      if (!key || !Number.isFinite(price) || price <= 0) continue;
      const current = map.get(key);
      if (!current || price < current) map.set(key, price);
    }
    return map;
  }, [liveProducts]);

  return (
    <div className="space-y-16">
      <section className="section">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">Premium Menswear Wholesale</p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
              TENZI: Where Premium Craftsmanship Meets Wholesale Excellence.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-charcoal">
              Crafted for the Modern Man. Built for Business. Supplying quality men&apos;s denim and
              trousers to retailers worldwide with dependable fulfillment and refined design.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/wholesale">Request Price List</Button>
              <Button to="/collections" variant="outline">
                View Wholesale Catalog
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-card relative overflow-hidden p-6">
              <div
                className="w-full overflow-hidden rounded-3xl bg-surface"
                style={{ aspectRatio: heroAspectRatio }}
              >
                <img
                  src="/images/models-hero.png"
                  alt="TENZI premium trousers"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onLoad={(event) => {
                    const img = event.currentTarget;
                    if (!img?.naturalWidth || !img?.naturalHeight) return;
                    setHeroAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
                  }}
                />
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Featured Line</p>
                <p className="font-display text-xl">Signature Micro-Texture Formals</p>
                <p className="text-sm text-muted">
                  Tailored silhouettes engineered for premium retail environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Explore Our Collection</p>
              <h2 className="section-title">Curated categories for modern menswear retail.</h2>
            </div>
            <Button to="/collections" variant="outline">
              Explore Collection
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="glass-card overflow-hidden">
                <div className="grid gap-6 p-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
                  <div>
                    <h3 className="font-display text-2xl">{category.name}</h3>
                    <p className="mt-3 text-sm text-muted">{category.description}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-charcoal">
                      {minPriceByCategory.get(category.id)
                        ? `From ${formatInrFromPaise(minPriceByCategory.get(category.id))}`
                        : "Pricing available"}
                    </p>
                  </div>
                  <div className="h-40 overflow-hidden rounded-2xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Why Wholesale with TENZI</p>
            <h2 className="section-title">Empowering your retail business.</h2>
            <p className="mt-4 text-muted">
              We offer high-margin, quality products with reliable supply and flexible order quantities to help your
              store succeed.
            </p>
            <div className="mt-8 grid gap-4">
              {valueProps.map((item) => (
                <div key={item.title} className="glass-card p-6">
                  <h3 className="font-display text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {featured.map((product) => (
              <div key={product.id || product.name} className="glass-card flex flex-col gap-4 p-5 sm:flex-row">
                <img
                  src={
                    product.mainPhotoURL ||
                    product.image ||
                    "/images/jeans.png"
                  }
                  alt={product.name}
                  className="h-28 w-full rounded-2xl object-cover sm:h-32 sm:w-40"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-charcoal">
                    {product.categoryName || product.category}
                  </p>
                  <h3 className="font-display text-xl">{product.name}</h3>
                  <p className="text-sm text-muted">{product.subtitle || product.description}</p>
                  {(product.displayPrice || product.price) && (
                    <p className="mt-2 text-sm font-semibold text-primary">
                      MRP: {product.displayPrice || formatInrFromPaise(product.price) || "—"}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    <span>{product.fit}</span>
                    <span>•</span>
                    <span>{product.fabric}</span>
                    <span>•</span>
                    <span>{product.wash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Let customers speak for us</p>
          <h2 className="section-title">Retail partners trust the TENZI standard.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="glass-card p-6">
                <p className="text-sm text-muted">“{testimonial.quote}”</p>
                <p className="mt-4 font-display text-lg">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-charcoal">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-3xl border border-primary bg-background p-10 text-center shadow-soft md:flex-row md:text-left">
          <div>
            <p className="eyebrow">Ready to scale</p>
            <h2 className="section-title">Partner with TENZI for your next wholesale order.</h2>
            <p className="mt-3 text-sm text-muted">
              Request the latest catalog, pricing, and production timelines tailored to your business.
            </p>
          </div>
          <Button to="/wholesale">Contact for Bulk Orders</Button>
        </div>
      </section>
    </div>
  );
}
