import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";
import normalizeProduct from "../utils/normalizeProduct";

const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  loading: false,

  // Admin-only: fetch all products (requires auth + admin role)
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/products");
      const products = (res.data.products ?? res.data)?.map(normalizeProduct) ?? [];
      set({ products, loading: false });
    } catch {
      set({ loading: false });
      toast.error("Failed to load products");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/products/featured");
      const products = (res.data || []).map(normalizeProduct);
      set({ featuredProducts: products, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  // Public: fetch products by category
  fetchByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await api.get(`/products/category/${category}`);
      // Handle both { products: [] } and [] shapes
      const products = (res.data.products ?? res.data)?.map(normalizeProduct) ?? [];
      set({ products, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  // Public: fetch all products for the shop "All" view
  fetchPublicProducts: async () => {
    set({ loading: true });
    try {
      const [featuredRes, recRes] = await Promise.all([
        api.get("/products/featured"),
        api.get("/products/recommendations"),
      ]);
      const all = [...(featuredRes.data || []), ...(recRes.data || [])].map(normalizeProduct);
      // Deduplicate by _id
      const unique = Array.from(new Map(all.map((p) => [p._id, p])).values());
      set({ products: unique, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRecommended: async () => {
    try {
      const res = await api.get("/products/recommendations");
      return (res.data || []).map(normalizeProduct);
    } catch {
      return [];
    }
  },

  createProduct: async (data) => {
    try {
      const res = await api.post("/products", data);
      const normalized = normalizeProduct(res.data);
      set((s) => ({ products: [...s.products, normalized] }));
      toast.success("Product created");
      return normalized;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create product");
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      const normalized = normalizeProduct(res.data);
      set((s) => ({
        products: s.products.map((p) => (p._id === id ? normalized : p)),
      }));
      toast.success("Product updated");
      return normalized;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update product");
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((s) => ({ products: s.products.filter((p) => p._id !== id) }));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  },

  toggleFeatured: async (id) => {
    try {
      const res = await api.patch(`/products/${id}`);
      const normalized = normalizeProduct(res.data);
      set((s) => ({
        products: s.products.map((p) => (p._id === id ? normalized : p)),
      }));
    } catch {
      toast.error("Failed to update product");
    }
  },
}));

export default useProductStore;
