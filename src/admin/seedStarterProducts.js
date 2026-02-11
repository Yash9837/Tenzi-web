import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase.js";

const formatDisplayPrice = (value) => {
  const amount = Number(value || 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const toPaise = (rupees) => {
  const numeric = Number(String(rupees).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
};

const defaultSizes = ["30", "32", "34", "36", "38", "40"].map((size) => ({
  size,
  inStock: true,
  stockCount: 1
}));

const starterProducts = [
  {
    name: "MARCOS",
    sku: "AR-2180",
    description: "Premium utility cargo with reinforced seams and retail-ready TENZI trims.",
    category: "cargo",
    categoryName: "Cargo",
    packing: "4 Pcs",
    priceRupees: 1599,
    fabric: "Cotton Twill",
    fit: "Tapered Fit",
    wash: "Charcoal",
    mainPhotoURL: "/images/model-cargo.jpg",
    photoURLs: ["/images/model-cargo.jpg", "/images/cargos.png"]
  },
  {
    name: "CURVE",
    sku: "AR-1252",
    description: "Classic denim line built for everyday retail sell-through and consistent sizing.",
    category: "jeans",
    categoryName: "Jeans",
    packing: "5 Pcs",
    priceRupees: 1449,
    fabric: "Stretch Denim",
    fit: "Slim Fit",
    wash: "Dark Indigo",
    mainPhotoURL: "/images/jeans.png",
    photoURLs: ["/images/jeans.png", "/images/straightfitjeans.png"]
  },
  {
    name: "JINDAL",
    sku: "AR-2179",
    description: "Contemporary slim chino with clean finishing and versatile seasonal colorways.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    priceRupees: 1339,
    fabric: "Cotton Stretch",
    fit: "Slim Fit",
    wash: "Sand",
    mainPhotoURL: "/images/trouser.png",
    photoURLs: ["/images/trouser.png"]
  },
  {
    name: "BMW",
    sku: "AR-2178",
    description: "Essential daily trousers engineered for comfort, repeat purchases, and store reliability.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    priceRupees: 1299,
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    wash: "Graphite",
    mainPhotoURL: "/images/formalpant.png",
    photoURLs: ["/images/formalpant.png"]
  },
  {
    name: "MASTER",
    sku: "AR-2169",
    description: "Premium textured formal trousers with sharp drape and refined micro surface.",
    category: "pants",
    categoryName: "Pants",
    packing: "5 Pcs",
    priceRupees: 1299,
    fabric: "Micro-Textured",
    fit: "Tailored Fit",
    wash: "Jet Black",
    mainPhotoURL: "/images/formalpant.png",
    photoURLs: ["/images/formalpant.png"]
  },
  {
    name: "LP",
    sku: "AR-2175",
    description: "Standard comfort chino with balanced stretch and clean modern profile.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    priceRupees: 1249,
    fabric: "Cotton Stretch",
    fit: "Relaxed Fit",
    wash: "Stone",
    mainPhotoURL: "/images/straightfitjeans.png",
    photoURLs: ["/images/straightfitjeans.png"]
  },
  {
    name: "GRAND",
    sku: "AR-2174",
    description: "Textured hybrid wear designed for retail versatility and high repeat demand.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    priceRupees: 1099,
    fabric: "Hybrid Blend",
    fit: "Regular Fit",
    wash: "Cinder",
    mainPhotoURL: "/images/trouser.png",
    photoURLs: ["/images/trouser.png"]
  },
  {
    name: "FIRE",
    sku: "AR-2172",
    description: "Micro-pattern texture trousers delivering a premium formal look with consistent fits.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    priceRupees: 1099,
    fabric: "Micro-Texture",
    fit: "Slim Fit",
    wash: "Onyx",
    mainPhotoURL: "/images/formalpant.png",
    photoURLs: ["/images/formalpant.png"]
  },
  {
    name: "STAR",
    sku: "AR-8426",
    description: "Micro-stripe formal trousers with sharp finishing and retail-ready branding.",
    category: "pants",
    categoryName: "Pants",
    packing: "5 Pcs",
    priceRupees: 1039,
    fabric: "Micro-Stripe",
    fit: "Tailored Fit",
    wash: "Charcoal",
    mainPhotoURL: "/images/formalpant.png",
    photoURLs: ["/images/formalpant.png"]
  }
];

export async function seedStarterProducts({ createdBy }) {
  const result = { created: 0, skipped: 0 };

  for (const item of starterProducts) {
    const productRef = collection(db, "products");
    const existing = await getDocs(
      query(productRef, where("sku", "==", item.sku), limit(1))
    );

    if (!existing.empty) {
      result.skipped += 1;
      continue;
    }

    const price = toPaise(item.priceRupees);

    await addDoc(productRef, {
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: item.category,
      categoryName: item.categoryName,
      packing: item.packing,
      price,
      displayPrice: formatDisplayPrice(price),
      mainPhotoURL: item.mainPhotoURL,
      photoURLs: item.photoURLs,
      sizes: defaultSizes,
      fabric: item.fabric,
      fit: item.fit,
      wash: item.wash,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: createdBy || ""
    });

    result.created += 1;
  }

  return result;
}
