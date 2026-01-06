// Jest globals are available without import
import { useProductStore } from '@/store/productStore';
import type { SelectedProduct } from '@/types/product';

describe('productStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useProductStore.setState({ products: [] });
  });

  describe('addProduct', () => {
    it('should add a product to the store', () => {
      const product: SelectedProduct = {
        id: 1,
        title: 'Test Product',
        variants: [{ id: 1, product_id: 1, title: 'Variant 1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      useProductStore.getState().addProduct(product);

      const products = useProductStore.getState().products;
      expect(products).toHaveLength(1);
      expect(products[0]).toEqual(product);
    });

    it('should add multiple products', () => {
      const product1: SelectedProduct = {
        id: 1,
        title: 'Product 1',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test1.jpg' },
      };

      const product2: SelectedProduct = {
        id: 2,
        title: 'Product 2',
        variants: [{ id: 2, product_id: 2, title: 'V2', price: '20.00' }],
        image: { id: 2, product_id: 2, src: '/test2.jpg' },
      };

      useProductStore.getState().addProduct(product1);
      useProductStore.getState().addProduct(product2);

      const products = useProductStore.getState().products;
      expect(products).toHaveLength(2);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product by index', () => {
      const product1: SelectedProduct = {
        id: 1,
        title: 'Product 1',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test1.jpg' },
      };

      const product2: SelectedProduct = {
        id: 2,
        title: 'Product 2',
        variants: [{ id: 2, product_id: 2, title: 'V2', price: '20.00' }],
        image: { id: 2, product_id: 2, src: '/test2.jpg' },
      };

      useProductStore.getState().addProduct(product1);
      useProductStore.getState().addProduct(product2);
      useProductStore.getState().removeProduct(0);

      const products = useProductStore.getState().products;
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(2);
    });
  });

  describe('updateProductDiscount', () => {
    it('should update product discount', () => {
      const product: SelectedProduct = {
        id: 1,
        title: 'Test Product',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
      };

      useProductStore.getState().addProduct(product);
      useProductStore.getState().updateProductDiscount(0, 20, 'percentage');

      const updatedProduct = useProductStore.getState().products[0];
      expect(updatedProduct.discount).toEqual({ value: 20, type: 'percentage' });
    });

    it('should update discount type', () => {
      const product: SelectedProduct = {
        id: 1,
        title: 'Test Product',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
        discount: { value: 10, type: 'percentage' },
      };

      useProductStore.getState().addProduct(product);
      useProductStore.getState().updateProductDiscount(0, 10, 'flat');

      const updatedProduct = useProductStore.getState().products[0];
      expect(updatedProduct.discount?.type).toBe('flat');
    });
  });

  describe('reorderProducts', () => {
    it('should reorder products correctly', () => {
      const product1: SelectedProduct = {
        id: 1,
        title: 'Product 1',
        variants: [{ id: 1, product_id: 1, title: 'V1', price: '10.00' }],
        image: { id: 1, product_id: 1, src: '/test1.jpg' },
      };

      const product2: SelectedProduct = {
        id: 2,
        title: 'Product 2',
        variants: [{ id: 2, product_id: 2, title: 'V2', price: '20.00' }],
        image: { id: 2, product_id: 2, src: '/test2.jpg' },
      };

      useProductStore.getState().addProduct(product1);
      useProductStore.getState().addProduct(product2);
      useProductStore.getState().reorderProducts(0, 1);

      const products = useProductStore.getState().products;
      expect(products[0].id).toBe(2);
      expect(products[1].id).toBe(1);
    });
  });

  describe('toggleVariantVisibility', () => {
    it('should toggle variant visibility', () => {
      const product: SelectedProduct = {
        id: 1,
        title: 'Test Product',
        variants: [
          { id: 1, product_id: 1, title: 'V1', price: '10.00' },
          { id: 2, product_id: 1, title: 'V2', price: '20.00' },
        ],
        image: { id: 1, product_id: 1, src: '/test.jpg' },
        variantsVisible: false,
      };

      useProductStore.getState().addProduct(product);
      useProductStore.getState().toggleVariantVisibility(0);

      const updatedProduct = useProductStore.getState().products[0];
      expect(updatedProduct.variantsVisible).toBe(true);
    });
  });
});

