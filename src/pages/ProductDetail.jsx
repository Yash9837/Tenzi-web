import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import Button from "../components/Button.jsx";
import { db } from "../lib/firebase.js";

const formatInrFromPaise = (paise) => {
  const amount = Number(paise || 0) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

function buildImageList(product) {
  const urls = [product?.mainPhotoURL, ...(product?.photoURLs || [])]
    .filter(Boolean)
    .map((url) => String(url));
  return Array.from(new Set(urls));
}

function getAvailableSizes(product) {
  const sizes = (product?.sizes || [])
    .filter((item) => item && item.size != null)
    .filter((item) => {
      const inStockFlag = item.inStock !== false;
      const qty = Number(item.stockCount);
      const qtyKnown = Number.isFinite(qty);
      // If qty is present, require qty > 0. Otherwise use the inStock flag only.
      return qtyKnown ? qty > 0 && inStockFlag : inStockFlag;
    })
    .map((item) => String(item.size))
    .filter(Boolean);

  return Array.from(new Set(sizes)).sort((a, b) => Number(a) - Number(b));
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(
      doc(db, "products", id),
      (snapshot) => {
        if (!snapshot.exists()) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct({ id: snapshot.id, ...snapshot.data() });
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const images = useMemo(() => buildImageList(product), [product]);
  const availableSizes = useMemo(() => getAvailableSizes(product), [product]);

  useEffect(() => {
    if (!images.length) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage((current) => {
      if (current && images.includes(current)) return current;
      return images[0];
    });
  }, [images]);

  if (loading) {
    return (
      <section className="section">
        <div className="mx-auto max-w-6xl text-muted">Loading product…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="mx-auto max-w-6xl text-danger">Failed to load product: {error.message}</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Not found</p>
          <h1 className="section-title">This product is not available.</h1>
          <p className="mt-3 text-muted">It may have been removed or the link is incorrect.</p>
          <div className="mt-8">
            <Button to="/collections">Back to Catalog</Button>
          </div>
        </div>
      </section>
    );
  }

  const displayPrice = product.displayPrice || formatInrFromPaise(product.price) || "—";

  return (
    <div className="space-y-12">
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted">
              <Link to="/collections" className="hover:text-primary hover:underline">
                Catalog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-charcoal">{product.categoryName || product.category || "Product"}</span>
            </div>
            <Button to="/wholesale" variant="outline">
              Wholesale Inquiry
            </Button>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-border bg-surface">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-[520px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[520px] items-center justify-center text-muted">
                    No image available
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((url) => {
                    const active = url === selectedImage;
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setSelectedImage(url)}
                        className={`overflow-hidden rounded-2xl border bg-background transition ${
                          active ? "border-primary" : "border-border hover:border-charcoal"
                        }`}
                      >
                        <img
                          src={url}
                          alt="Product thumbnail"
                          className="h-20 w-20 object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="eyebrow">Article</p>
              <h1 className="mt-3 font-display text-4xl">{product.name}</h1>
              <p className="mt-3 text-muted">Article No.: {product.sku || "-"}</p>

              <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">MRP</p>
                  <p className="mt-2 font-display text-2xl">{displayPrice}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Packing</p>
                  <p className="mt-2 font-display text-2xl">{product.packing || "—"}</p>
                </div>
              </div>

              {product.description && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Description</p>
                  <p className="mt-3 text-muted">{product.description}</p>
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="glass-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Fabric</p>
                  <p className="mt-2 font-display text-lg">{product.fabric || "—"}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Fit</p>
                  <p className="mt-2 font-display text-lg">{product.fit || "—"}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Wash</p>
                  <p className="mt-2 font-display text-lg">{product.wash || "—"}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Status</p>
                  <p className="mt-2 font-display text-lg">
                    {product.isActive === false ? "Inactive" : "Active"}
                  </p>
                </div>
              </div>

              {product.sizes?.length ? (
                <div className="mt-10">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Available Sizes</p>
                  {availableSizes.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-full border border-border bg-background px-4 py-2 font-display text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      Size availability will be shared with your wholesale quotation.
                    </p>
                  )}
                </div>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-4">
                <Button to="/wholesale">Request Bulk Pricing</Button>
                <Button to="/collections" variant="outline">
                  Back to Catalog
                </Button>
              </div>

              <div className="mt-10 rounded-3xl border border-border bg-background p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Need help?</p>
                <p className="mt-3 text-sm text-muted">
                  For distributor terms, pack ratios, and delivery timelines, contact the TENZI wholesale team.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="mailto:tenzijeans@gmail.com" className="btn btn-outline text-xs">
                    Email tenzijeans@gmail.com
                  </a>
                  <a href="tel:+917982577067" className="btn btn-outline text-xs">
                    Call +91 7982577067
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
