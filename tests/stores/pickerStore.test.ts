// Jest globals are available without import
import { usePickerStore } from '@/store/pickerStore';
import type { Product, SelectedProduct } from '@/types/product';

// Mock the API
jest.mock('@/services/api', () => ({
  fetchProducts: jest.fn(() => Promise.resolve([])),
}));

describe('pickerStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePickerStore.setState({
      isOpen: false,
      editingProductIndex: null,
      searchQuery: '',
      selectedProducts: [],
      allProducts: [],
      currentPage: 0,
      hasMore: true,
      isLoading: false,
    });
  });

  describe('openPicker', () => {
    it('should open picker and set editing index', () => {
      usePickerStore.getState().openPicker(5);

      const state = usePickerStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.editingProductIndex).toBe(5);
      expect(state.searchQuery).toBe('');
      expect(state.selectedProducts).toEqual([]);
    });
  });

  describe('closePicker', () => {
    it('should close picker and reset state', () => {
      usePickerStore.setState({
        isOpen: true,
        editingProductIndex: 1,
        searchQuery: 'test',
        selectedProducts: [],
      });

      usePickerStore.getState().closePicker();

      const state = usePickerStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.editingProductIndex).toBe(null);
      expect(state.searchQuery).toBe('');
      expect(state.selectedProducts).toEqual([]);
    });
  });

  describe('setSelectionForProduct', () => {
    it('should set selection for a single product', () => {
      const product: SelectedProduct = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().setSelectionForProduct(product);

      const selectedProducts = usePickerStore.getState().selectedProducts;
      expect(selectedProducts).toHaveLength(1);
      expect(selectedProducts[0].id).toBe(1);
      expect(selectedProducts[0].variants).toHaveLength(2);
    });

    it('should clear selection when product is null', () => {
      usePickerStore.setState({
        selectedProducts: [
          {
            id: 1,
            title: 'Test',
            variants: [],
            image: { id: 1, product_id: 1, src: '/test.jpg' },
          },
        ],
      });

      usePickerStore.getState().setSelectionForProduct(null);

      expect(usePickerStore.getState().selectedProducts).toEqual([]);
    });
  });

  describe('toggleVariantSelection', () => {
    it('should add variant to selection', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleVariantSelection(product, 1);

      const selectedProducts = usePickerStore.getState().selectedProducts;
      expect(selectedProducts).toHaveLength(1);
      expect(selectedProducts[0].variants).toHaveLength(1);
      expect(selectedProducts[0].variants[0].id).toBe(1);
    });

    it('should remove variant from selection', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleVariantSelection(product, 1);
      usePickerStore.getState().toggleVariantSelection(product, 1);

      const selectedProducts = usePickerStore.getState().selectedProducts;
      expect(selectedProducts).toEqual([]);
    });
  });

  describe('toggleAllVariants', () => {
    it('should select all variants', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleAllVariants(product, true);

      const selectedProducts = usePickerStore.getState().selectedProducts;
      expect(selectedProducts).toHaveLength(1);
      expect(selectedProducts[0].variants).toHaveLength(2);
    });

    it('should deselect all variants', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleAllVariants(product, true);
      usePickerStore.getState().toggleAllVariants(product, false);

      const selectedProducts = usePickerStore.getState().selectedProducts;
      expect(selectedProducts).toEqual([]);
    });
  });

  describe('isVariantSelected', () => {
    it('should return true if variant is selected', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleVariantSelection(product, 1);

      expect(usePickerStore.getState().isVariantSelected(1, 1)).toBe(true);
    });

    it('should return false if variant is not selected', () => {
      expect(usePickerStore.getState().isVariantSelected(1, 1)).toBe(false);
    });
  });

  describe('resetSelection', () => {
    it('should clear all selected products', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      usePickerStore.getState().toggleVariantSelection(product, 1);
      usePickerStore.getState().resetSelection();

      expect(usePickerStore.getState().selectedProducts).toEqual([]);
    });
  });
});

