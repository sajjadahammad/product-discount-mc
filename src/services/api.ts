import type { Product } from '@/types/product';
import { apiClient } from '@/lib/axios';

export interface FetchProductsParams {
  search?: string;
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 10;

export async function fetchProducts({
  search = '',
  page = 0,
  limit = DEFAULT_LIMIT,
}: FetchProductsParams = {}): Promise<Product[]> {
  try {
    const response = await apiClient.get<Product[] | null>('/products/search', {
      params: {
        search,
        page,
        limit,
      },
    });

    const data = response.data;

    // API can return null when there are no products. Normalize to an empty array.
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    console.warn('Unexpected products response shape, returning empty array:', data);
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

