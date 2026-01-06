import { create } from 'zustand';
import type { Product, SelectedProduct } from '@/types/product';
import { fetchProducts } from '@/services/api';

interface PickerStore {
  isOpen: boolean;
  editingProductIndex: number | null;
  searchQuery: string;
  selectedProducts: Product[];
  allProducts: Product[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  openPicker: (index: number) => void;
  closePicker: () => void;
  setSearchQuery: (query: string) => void;
  setSelectionForProduct: (product: SelectedProduct | null) => void;
   setSelectionFromProducts: (products: SelectedProduct[]) => void;
  toggleProductSelection: (product: Product) => void;
  toggleVariantSelection: (product: Product, variantId: number) => void;
  toggleAllVariants: (product: Product, selectAll: boolean) => void;
  loadProducts: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  resetSelection: () => void;
  isProductSelected: (productId: number) => boolean;
  isVariantSelected: (productId: number, variantId: number) => boolean;
}

export const usePickerStore = create<PickerStore>((set, get) => ({
  isOpen: false,
  editingProductIndex: null,
  searchQuery: '',
  selectedProducts: [],
  allProducts: [],
  currentPage: 0,
  hasMore: true,
  isLoading: false,

  openPicker: (index) =>
    set({
      isOpen: true,
      editingProductIndex: index,
      searchQuery: '',
      selectedProducts: [],
      allProducts: [],
      currentPage: 0,
      hasMore: true,
    }),

  closePicker: () =>
    set({
      isOpen: false,
      editingProductIndex: null,
      searchQuery: '',
      selectedProducts: [],
    }),

  setSearchQuery: (query) => {
    const state = get();
    if (state.searchQuery === query) return;
    set({ searchQuery: query, allProducts: [], currentPage: 0, hasMore: true });
    // Trigger loadProducts if picker is open
    if (state.isOpen && !state.isLoading) {
      state.loadProducts();
    }
  },

  // Set selection based on an already chosen product when editing
  setSelectionForProduct: (product) => {
    if (!product) {
      set({ selectedProducts: [] });
      return;
    }
    set({
      selectedProducts: [
        {
          id: product.id,
          title: product.title,
          image: product.image,
          variants: [...product.variants],
        },
      ],
    });
  },

  // Set selection based on the full current product list when adding
  setSelectionFromProducts: (products) => {
    if (!products || products.length === 0) {
      set({ selectedProducts: [] });
      return;
    }

    set({
      selectedProducts: products.map((product) => ({
        id: product.id,
        title: product.title,
        image: product.image,
        variants: [...product.variants],
      })),
    });
  },

  toggleProductSelection: (product) => {
    const state = get();
    const isSelected = state.isProductSelected(product.id);

    if (isSelected) {
      set({
        selectedProducts: state.selectedProducts.filter(
          (p) => p.id !== product.id
        ),
      });
    } else {
      set({
        selectedProducts: [...state.selectedProducts, product],
      });
    }
  },

  toggleVariantSelection: (product, variantId) => {
    const state = get();
    const existingProduct = state.selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      const variantExists = existingProduct.variants.some((v) => v.id === variantId);
      if (variantExists) {
        // Remove variant
        const updatedVariants = existingProduct.variants.filter(
          (v) => v.id !== variantId
        );
        if (updatedVariants.length === 0) {
          set({
            selectedProducts: state.selectedProducts.filter(
              (p) => p.id !== product.id
            ),
          });
        } else {
          set({
            selectedProducts: state.selectedProducts.map((p) =>
              p.id === product.id
                ? { ...p, variants: updatedVariants }
                : p
            ),
          });
        }
      } else {
        // Add variant
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          set({
            selectedProducts: state.selectedProducts.map((p) =>
              p.id === product.id
                ? { ...p, variants: [...p.variants, variant] }
                : p
            ),
          });
        }
      }
    } else {
      // Product doesn't exist, add it with this variant
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        set({
          selectedProducts: [
            ...state.selectedProducts,
            { ...product, variants: [variant] },
          ],
        });
      }
    }
  },

  toggleAllVariants: (product: Product, selectAll: boolean) => {
    const state = get();
    if (selectAll) {
      // Add product with all variants
      const existingProduct = state.selectedProducts.find((p) => p.id === product.id);
      if (!existingProduct) {
        set({
          selectedProducts: [
            ...state.selectedProducts,
            { ...product, variants: [...product.variants] },
          ],
        });
      } else {
        // Update existing product to include all variants
        const allVariantIds = new Set(existingProduct.variants.map((v: { id: number }) => v.id));
        const missingVariants = product.variants.filter(
          (v) => !allVariantIds.has(v.id)
        );
        if (missingVariants.length > 0) {
          set({
            selectedProducts: state.selectedProducts.map((p) =>
              p.id === product.id
                ? { ...p, variants: [...p.variants, ...missingVariants] }
                : p
            ),
          });
        }
      }
    } else {
      // Remove all variants (remove product)
      set({
        selectedProducts: state.selectedProducts.filter(
          (p) => p.id !== product.id
        ),
      });
    }
  },

  loadProducts: async () => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true });

    try {
      const products = await fetchProducts({
        search: state.searchQuery,
        page: 0,
        limit: 10,
      });

      const safeProducts = Array.isArray(products) ? products : [];

      set({
        allProducts: safeProducts,
        currentPage: 0,
        hasMore: safeProducts.length === 10,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ isLoading: false });
    }
  },

  loadMoreProducts: async () => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    set({ isLoading: true });

    try {
      const nextPage = state.currentPage + 1;
      const products = await fetchProducts({
        search: state.searchQuery,
        page: nextPage,
        limit: 10,
      });

      const safeProducts = Array.isArray(products) ? products : [];

      set({
        allProducts: [...state.allProducts, ...safeProducts],
        currentPage: nextPage,
        hasMore: safeProducts.length === 10,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading more products:', error);
      set({ isLoading: false });
    }
  },

  resetSelection: () => set({ selectedProducts: [] }),

  isProductSelected: (productId) => {
    const state = get();
    return state.selectedProducts.some((p) => p.id === productId);
  },

  isVariantSelected: (productId, variantId) => {
    const state = get();
    const product = state.selectedProducts.find((p) => p.id === productId);
    if (!product) return false;
    return product.variants.some((v) => v.id === variantId);
  },
}));

