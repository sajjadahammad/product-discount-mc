import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api';

export function useProducts(search: string = '', enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['products', search],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        search,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // lastPage can be null/undefined; normalize length safely
      const pageLength = Array.isArray(lastPage) ? lastPage.length : 0;
      // If last page has 10 items, there might be more
      return pageLength === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 0, // Always consider data stale, refetch on mount
    gcTime: 1000 * 60, // Keep data in cache for 1 minute when inactive
    refetchOnMount: 'always', // Always refetch when component mounts
  });
}

