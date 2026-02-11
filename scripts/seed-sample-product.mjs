import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";

// Uses Firebase client SDK (same project as the website). Requires Firestore rules
// to allow writes for this signed-in user.
const firebaseConfig = {
  apiKey: "AIzaSyAMsCAMI3thMIXzYg8fS3OKp1-nnJpB3HY",
  authDomain: "tenzi-web.firebaseapp.com",
  projectId: "tenzi-web",
  storageBucket: "tenzi-web.firebasestorage.app",
  messagingSenderId: "80337702166",
  appId: "1:80337702166:web:0c3119830b9e5b4f161437",
  measurementId: "G-DP2TEK6XX2"
};

const email = process.env.SEED_EMAIL;
const password = process.env.SEED_PASSWORD;

if (!email || !password) {
  console.error("Missing credentials. Usage:");
  console.error(
    '  SEED_EMAIL="admin@example.com" SEED_PASSWORD="yourpassword" npm run seed:sample'
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const formatDisplayPrice = (paise) => {
  const amount = Number(paise || 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const makeSizes = (sizes) =>
  sizes.map((size) => ({
    size: String(size),
    inStock: true,
    stockCount: 1
  }));

// Starter products (MRP shown publicly; wholesale inquiry still recommended for bulk terms).
const starterProducts = [
  {
    name: "MARCOS",
    sku: "AR-2180",
    description: "Premium utility cargo with reinforced seams and retail-ready TENZI trims.",
    category: "cargo",
    categoryName: "Cargo",
    packing: "4 Pcs",
    price: 1599 * 100,
    fabric: "Cotton Twill",
    fit: "Tapered Fit",
    wash: "Charcoal",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["32", "34", "36", "38"]),
    isActive: true
  },
  {
    name: "CURVE",
    sku: "AR-1252",
    description: "Classic denim line built for everyday retail sell-through and consistent sizing.",
    category: "jeans",
    categoryName: "Jeans",
    packing: "5 Pcs",
    price: 1449 * 100,
    fabric: "Stretch Denim",
    fit: "Slim Fit",
    wash: "Dark Indigo",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36", "38"]),
    isActive: true
  },
  {
    name: "JINDAL",
    sku: "AR-2179",
    description: "Contemporary slim chino with clean finishing and versatile seasonal colorways.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    price: 1339 * 100,
    fabric: "Cotton Stretch",
    fit: "Slim Fit",
    wash: "Sand",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36", "38"]),
    isActive: true
  },
  {
    name: "BMW",
    sku: "AR-2178",
    description: "Essential daily trousers engineered for comfort, repeat purchases, and store reliability.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    price: 1299 * 100,
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    wash: "Graphite",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36", "38"]),
    isActive: true
  },
  {
    name: "MASTER",
    sku: "AR-2169",
    description: "Premium textured formal trousers with sharp drape and refined micro surface.",
    category: "pants",
    categoryName: "Pants",
    packing: "5 Pcs",
    price: 1299 * 100,
    fabric: "Micro-Textured",
    fit: "Tailored Fit",
    wash: "Jet Black",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36", "38"]),
    isActive: true
  },
  {
    name: "LP",
    sku: "AR-2175",
    description: "Standard comfort chino with balanced stretch and clean modern profile.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    price: 1249 * 100,
    fabric: "Cotton Stretch",
    fit: "Relaxed Fit",
    wash: "Stone",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36"]),
    isActive: true
  },
  {
    name: "GRAND",
    sku: "AR-2174",
    description: "Textured hybrid wear designed for retail versatility and high repeat demand.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    price: 1099 * 100,
    fabric: "Hybrid Blend",
    fit: "Regular Fit",
    wash: "Cinder",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36"]),
    isActive: true
  },
  {
    name: "FIRE",
    sku: "AR-2172",
    description: "Micro-pattern texture trousers delivering a premium formal look with consistent fits.",
    category: "trousers",
    categoryName: "Trousers",
    packing: "5 Pcs",
    price: 1099 * 100,
    fabric: "Micro-Texture",
    fit: "Slim Fit",
    wash: "Onyx",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["32", "34", "35", "36", "38"]),
    isActive: true
  },
  {
    name: "STAR",
    sku: "AR-8426",
    description: "Micro-stripe formal trousers with sharp finishing and retail-ready branding.",
    category: "pants",
    categoryName: "Pants",
    packing: "5 Pcs",
    price: 1039 * 100,
    fabric: "Micro-Stripe",
    fit: "Tailored Fit",
    wash: "Charcoal",
    mainPhotoURL:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop",
    photoURLs: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
    ],
    sizes: makeSizes(["30", "32", "34", "36", "38"]),
    isActive: true
  }
].map((product) => ({ ...product, displayPrice: formatDisplayPrice(product.price) }));

await signInWithEmailAndPassword(auth, email, password);
const createdBy = auth.currentUser?.uid || "";
let created = 0;
let skipped = 0;

for (const product of starterProducts) {
  const existing = await getDocs(
    query(collection(db, "products"), where("sku", "==", product.sku), limit(1))
  );

  if (!existing.empty) {
    skipped += 1;
    continue;
  }

  await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy
  });
  created += 1;
}

console.log(`Seed complete: ${created} created, ${skipped} skipped.`);
