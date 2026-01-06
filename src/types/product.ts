export interface Image {
  id: number;
  product_id: number;
  src: string;
}

export interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
}

export interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: Image;
}

export type DiscountType = 'percentage' | 'flat';

export interface Discount {
  value: number;
  type: DiscountType;
}

export interface SelectedProduct extends Product {
  discount?: Discount;
  variantDiscounts?: Record<number, Discount>;
  variantsVisible?: boolean;
}


