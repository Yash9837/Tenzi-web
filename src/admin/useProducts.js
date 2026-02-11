import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const outOfStock = products.filter((p) => isOutOfStock(p)).length;
    return { total, active, outOfStock };
  }, [products]);

  return { products, loading, error, stats };
}

export function isOutOfStock(product) {
  if (!product?.sizes?.length) return true;
  return product.sizes.every((size) => size.inStock === false);
}

export function getAvailableSizes(product) {
  if (!product?.sizes?.length) return [];
  return product.sizes
    .filter((size) => size && size.size != null && size.inStock !== false)
    .map((size) => String(size.size))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b));
}

export function getAvailableSizesLabel(product) {
  const sizes = getAvailableSizes(product);
  return sizes.length ? sizes.join(", ") : "—";
}
