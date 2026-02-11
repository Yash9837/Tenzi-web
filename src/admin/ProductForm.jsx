import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import { db, storage } from "../lib/firebase.js";
import Button from "../components/Button.jsx";
import { useAuth } from "./AuthProvider.jsx";
import { getStoragePathFromUrl, resizeImage } from "./imageUtils.js";

const categoryOptions = [
  { value: "jeans", label: "Jeans" },
  { value: "cargo", label: "Cargo" },
  { value: "trousers", label: "Trousers" },
  { value: "pants", label: "Pants" },
  { value: "joggers", label: "Joggers" }
];

const sizeDefaults = ["30", "32", "34", "36", "38", "40"];

const formatDisplayPrice = (value) => {
  const amount = Number(value || 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const createEmptySizes = () =>
  sizeDefaults.map((size) => ({
    size,
    inStock: true,
    stockCount: 1
  }));

export default function ProductForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: categoryOptions[0].value,
    categoryName: categoryOptions[0].label,
    description: "",
    packing: "",
    mainPhotoURL: "",
    photoURLs: [],
    sizes: createEmptySizes(),
    sku: "",
    fabric: "",
    fit: "",
    wash: "",
    isActive: true
  });

  const [mainPhotoFile, setMainPhotoFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [removedPhotoURLs, setRemovedPhotoURLs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFormData({
          name: data.name || "",
          price: data.price || "",
          category: data.category || categoryOptions[0].value,
          categoryName: data.categoryName || categoryOptions[0].label,
          description: data.description || "",
          packing: data.packing || "",
          mainPhotoURL: data.mainPhotoURL || "",
          photoURLs: data.photoURLs || [],
          sizes: data.sizes?.length ? data.sizes : createEmptySizes(),
          sku: data.sku || "",
          fabric: data.fabric || "",
          fit: data.fit || "",
          wash: data.wash || "",
          isActive: data.isActive !== false
        });
      }
    };

    fetchProduct().catch((err) => setError(err.message));
  }, [id, isEditMode]);

  const categoryLabel = useMemo(() => {
    const found = categoryOptions.find((option) => option.value === formData.category);
    return found ? found.label : formData.categoryName;
  }, [formData.category, formData.categoryName]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    const label = categoryOptions.find((option) => option.value === value)?.label || value;
    setFormData((prev) => ({
      ...prev,
      category: value,
      categoryName: label
    }));
  };

  const setSizeAvailable = (index, available) => {
    setFormData((prev) => {
      const sizes = [...prev.sizes];
      const current = sizes[index] || {};
      sizes[index] = {
        ...current,
        inStock: Boolean(available),
        // Keep a minimal non-zero value so older logic stays compatible.
        stockCount: available ? 1 : 0
      };
      return { ...prev, sizes };
    });
  };

  const setAllSizesAvailable = (available) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item) => ({
        ...item,
        inStock: Boolean(available),
        stockCount: available ? 1 : 0
      }))
    }));
  };

  const handleAdditionalFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setAdditionalFiles(files);
  };

  const uploadImage = async (file, path, progressKey) => {
    const compressed = await resizeImage(file, 800, 0.85);
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, compressed);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress((prev) => ({ ...prev, [progressKey]: percent }));
        },
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const removeExistingPhoto = (url) => {
    setFormData((prev) => ({
      ...prev,
      photoURLs: prev.photoURLs.filter((photo) => photo !== url)
    }));
    setRemovedPhotoURLs((prev) => [...prev, url]);
  };

  const deleteRemovedPhotos = async () => {
    for (const url of removedPhotoURLs) {
      const path = getStoragePathFromUrl(url);
      if (!path) continue;
      await deleteObject(ref(storage, path)).catch(() => null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!mainPhotoFile && !formData.mainPhotoURL) {
      setError("Main photo is required.");
      setLoading(false);
      return;
    }

    try {
      const docRef = isEditMode ? doc(db, "products", id) : doc(collection(db, "products"));
      const productId = docRef.id;

      let mainPhotoURL = formData.mainPhotoURL;
      if (mainPhotoFile) {
        mainPhotoURL = await uploadImage(
          mainPhotoFile,
          `product-images/${productId}/main-${Date.now()}.jpg`,
          "main"
        );
      }

      let additionalURLs = formData.photoURLs;
      if (additionalFiles.length) {
        const uploads = await Promise.all(
          additionalFiles.map((file, index) =>
            uploadImage(
              file,
              `product-images/${productId}/extra-${Date.now()}-${index}.jpg`,
              `extra-${index}`
            )
          )
        );
        additionalURLs = [...additionalURLs, ...uploads];
      }

      const payload = {
        ...formData,
        price: Number(formData.price || 0),
        displayPrice: formatDisplayPrice(formData.price),
        mainPhotoURL,
        photoURLs: additionalURLs,
        categoryName: categoryLabel,
        updatedAt: serverTimestamp()
      };

      if (!isEditMode) {
        payload.createdAt = serverTimestamp();
        payload.createdBy = user?.uid || "";
      }

      if (isEditMode) {
        await updateDoc(docRef, payload);
      } else {
        await setDoc(docRef, payload);
      }

      await deleteRemovedPhotos();

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  const handlePermanentDelete = async () => {
    if (!isEditMode) return;
    const confirmDelete = window.confirm(
      "Delete this product permanently? This will remove images from storage."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const allUrls = [formData.mainPhotoURL, ...formData.photoURLs].filter(Boolean);
      for (const url of allUrls) {
        const path = getStoragePathFromUrl(url);
        if (path) {
          await deleteObject(ref(storage, path)).catch(() => null);
        }
      }
      await deleteDoc(doc(db, "products", id));
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">{isEditMode ? "Edit Product" : "Add Product"}</p>
        <h1 className="section-title">{isEditMode ? "Update product details" : "Create a new product"}.</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-danger/50 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card space-y-4 p-6">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">MRP (Paise)</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                  min="0"
                />
                <p className="mt-1 text-xs text-muted">Display: {formatDisplayPrice(formData.price)}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Packing (Box)</label>
                <input
                  name="packing"
                  value={formData.packing}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary placeholder:text-muted focus:border-primary focus:ring-primary/20"
                  placeholder="e.g., 5 Pcs"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-muted">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Article No.</label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Fabric</label>
                <input
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Fit</label>
                <input
                  name="fit"
                  value={formData.fit}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Wash</label>
                <input
                  name="wash"
                  value={formData.wash}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border-border bg-background text-primary focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-border text-primary"
              />
              <label htmlFor="isActive" className="text-sm text-muted">
                Active listing (visible to wholesale buyers)
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Main Photo</p>
              <div className="mt-4 space-y-4">
                {(mainPhotoFile || formData.mainPhotoURL) && (
                  <img
                    src={mainPhotoFile ? URL.createObjectURL(mainPhotoFile) : formData.mainPhotoURL}
                    alt="Main preview"
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setMainPhotoFile(event.target.files?.[0] || null)}
                  className="text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.3em] file:text-background"
                />
                {uploadProgress.main && (
                  <p className="text-xs text-muted">Uploading: {uploadProgress.main}%</p>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Additional Photos</p>
              <div className="mt-4 grid gap-3">
                <div className="flex flex-wrap gap-3">
                  {formData.photoURLs.map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="Additional" className="h-20 w-20 rounded-xl object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(url)}
                        className="absolute -right-2 -top-2 rounded-full bg-danger px-2 py-1 text-xs text-background"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  {additionalFiles.map((file, index) => (
                    <img
                      key={`${file.name}-${index}`}
                      src={URL.createObjectURL(file)}
                      alt="New upload preview"
                      className="h-20 w-20 rounded-xl object-cover opacity-80"
                    />
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalFiles}
                  className="text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.3em] file:text-background"
                />
                {Object.entries(uploadProgress)
                  .filter(([key]) => key.startsWith("extra-"))
                  .map(([key, value]) => (
                    <p key={key} className="text-xs text-muted">
                      {key.replace("extra-", "Photo ")}: {value}%
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Available Sizes</p>
          <p className="mt-2 text-sm text-muted">
            Select which sizes are available for wholesale (shown on the product detail page).
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAllSizesAvailable(true)}
              className="btn btn-outline text-xs"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setAllSizesAvailable(false)}
              className="btn btn-outline text-xs"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {formData.sizes.map((size, index) => {
              const active = size.inStock !== false;
              return (
                <button
                  key={size.size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSizeAvailable(index, !active)}
                  className={`rounded-full border px-5 py-2 font-display text-sm transition ${
                    active
                      ? "border-primary bg-primary text-background"
                      : "border-border bg-background text-primary hover:border-charcoal"
                  }`}
                >
                  {size.size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
          <Button to="/admin/products" variant="outline">
            Cancel
          </Button>
          {isEditMode && (
            <button
              type="button"
              onClick={handlePermanentDelete}
              className="btn border border-danger text-danger hover:bg-danger hover:text-background"
            >
              Delete Permanently
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
