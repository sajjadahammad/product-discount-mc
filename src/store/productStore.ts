import { create } from 'zustand';
import type { SelectedProduct, DiscountType } from '@/types/product';

interface ProductStore {
  products: SelectedProduct[];
  addProduct: (product: SelectedProduct) => void;
  removeProduct: (index: number) => void;
  updateProduct: (index: number, product: SelectedProduct) => void;
  replaceProduct: (index: number, products: SelectedProduct[]) => void;
  reorderProducts: (fromIndex: number, toIndex: number) => void;
  updateProductDiscount: (
    productIndex: number,
    discount: number,
    type: DiscountType
  ) => void;
  updateVariantDiscount: (
    productIndex: number,
    variantIndex: number,
    discount: number,
    type: DiscountType
  ) => void;
  toggleVariantVisibility: (productIndex: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  removeProduct: (index) =>
    set((state) => ({
      products: state.products.filter((_, i) => i !== index),
    })),

  updateProduct: (index, product) =>
    set((state) => ({
      products: state.products.map((p, i) => (i === index ? product : p)),
    })),

  replaceProduct: (index, newProducts) =>
    set((state) => {
      const newList = [...state.products];
      newList.splice(index, 1, ...newProducts);
      return { products: newList };
    }),

  reorderProducts: (fromIndex, toIndex) =>
    set((state) => {
      const newProducts = [...state.products];
      const [moved] = newProducts.splice(fromIndex, 1);
      newProducts.splice(toIndex, 0, moved);
      return { products: newProducts };
    }),

  updateProductDiscount: (productIndex, discount, type) =>
    set((state) => {
      const product = state.products[productIndex];
      if (!product) return state;

      // Create variant discounts object with discount applied to all variants
      const variantDiscounts: Record<number, { value: number; type: DiscountType }> = {};
      product.variants.forEach((variant) => {
        variantDiscounts[variant.id] = { value: discount, type };
      });

      return {
        products: state.products.map((p, i) =>
          i === productIndex
            ? {
                ...p,
                discount: { value: discount, type },
                variantDiscounts,
              }
            : p
        ),
      };
    }),

  updateVariantDiscount: (productIndex, variantIndex, discount, type) =>
    set((state) => ({
      products: state.products.map((p, i) => {
        if (i !== productIndex) return p;
        const variantDiscounts = p.variantDiscounts || {};
        return {
          ...p,
          variantDiscounts: {
            ...variantDiscounts,
            [variantIndex]: { value: discount, type },
          },
        };
      }),
    })),

  toggleVariantVisibility: (productIndex) =>
    set((state) => ({
      products: state.products.map((p, i) =>
        i === productIndex
          ? { ...p, variantsVisible: !p.variantsVisible }
          : p
      ),
    })),
}));

