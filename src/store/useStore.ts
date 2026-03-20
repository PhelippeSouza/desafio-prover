import { create } from "zustand";
import { Store, Product, StoreFormData, ProductFormData } from "../types";

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  products: Product[];
  loading: boolean;
  error: string | null;

  // Store actions
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  removeStore: (storeId: string) => void;
  setSelectedStore: (store: Store | null) => void;

  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, product: Partial<Product>) => void;
  getStorProducts: (storeId: string) => Product[];

  // Loading and error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API calls
  fetchStores: () => Promise<void>;
  fetchProducts: (storeId?: string) => Promise<void>;
  createStore: (data: StoreFormData) => Promise<void>;
  createProduct: (data: ProductFormData, storeId: string) => Promise<void>;
  deleteStore: (storeId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  stores: [],
  selectedStore: null,
  products: [],
  loading: false,
  error: null,

  // Store actions
  setStores: (stores) => set({ stores }),
  addStore: (store) =>
    set((state) => ({
      stores: [...state.stores, store],
    })),
  removeStore: (storeId) =>
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== storeId),
    })),
  setSelectedStore: (store) => set({ selectedStore: store }),

  // Product actions
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((item) => item.id !== productId),
    })),
  updateProduct: (productId, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      ),
    })),
  getStorProducts: (storeId) => {
    const { products } = get();
    return products.filter((p) => p.storeId === storeId);
  },

  // Loading and error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // API calls
  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/stores");
      const stores = await response.json();
      set({ stores });
    } catch (error) {
      set({ error: "Erro ao carregar lojas" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async (storeId?: string) => {
    set({ loading: true, error: null });
    try {
      const url = storeId ? `/products?storeId=${storeId}` : "/products";
      const response = await fetch(url);
      const products = await response.json();
      set({ products });
    } catch (error) {
      set({ error: "Erro ao carregar produtos" });
    } finally {
      set({ loading: false });
    }
  },

  createStore: async (data: StoreFormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const store = await response.json();
      get().addStore(store);
    } catch (error) {
      set({ error: "Erro ao criar loja" });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (data: ProductFormData, storeId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, storeId }),
      });
      const product = await response.json();
      get().addProduct(product);
    } catch (error) {
      set({ error: "Erro ao criar produto" });
    } finally {
      set({ loading: false });
    }
  },

  deleteStore: async (storeId: string) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/stores/${storeId}`, { method: "POST" });
      get().removeStore(storeId);

    } catch (error) {
      set({ error: "Erro ao deletar loja" });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      await fetch(`/products/${productId}`, { method: "POST" });
      get().removeProduct(productId);
      
    } catch (error) {
      set({ error: "Erro ao deletar produto" });
    } finally {
      set({ loading: false });
    }
  },

  updateProductQuantity: async (productId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const product = await response.json();
      get().updateProduct(productId, product);
    } catch (error) {
      set({ error: "Erro ao atualizar produto" });
    } finally {
      set({ loading: false });
    }
  },
}));
