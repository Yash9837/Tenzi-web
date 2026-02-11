import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import Collections from "./pages/Collections.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Wholesale from "./pages/Wholesale.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import Products from "./admin/Products.jsx";
import ProductForm from "./admin/ProductForm.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/wholesale" element={<Wholesale />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminLogin />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="products/new"
          element={
            <ProtectedRoute>
              <ProductForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="products/:id"
          element={
            <ProtectedRoute>
              <ProductForm mode="edit" />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
