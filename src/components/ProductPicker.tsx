import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePickerStore } from '@/store/pickerStore';
import { useProductStore } from '@/store/productStore';
import type { SelectedProduct } from '@/types/product';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const DEFAULT_IMAGE = '/monk.png';

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-16 h-16 shrink-0">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 rounded border border-gray-200 animate-pulse" />
      )}
      <img
        src={imageError ? DEFAULT_IMAGE : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
        className={`w-16 h-16 object-cover rounded border border-gray-200 transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export function ProductPicker() {
  const {
    isOpen,
    editingProductIndex,
    searchQuery,
    selectedProducts,
    closePicker,
    setSearchQuery,
    toggleVariantSelection,
    toggleAllVariants,
    resetSelection,
    isVariantSelected,
  } = usePickerStore();

  const {
    products,
    replaceProduct,
    addProduct,
  } = useProductStore();

  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useProducts(debouncedSearchQuery, isOpen);

  // Invalidate and refetch products when modal opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      // Invalidate all product queries to clear cache and force fresh fetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setLocalSearchQuery(searchQuery);
    } else {
      setLocalSearchQuery('');
    }
  }, [isOpen, searchQuery, queryClient]);

  // Update store when debounced value changes (React Query will auto-refetch on query key change)
  useEffect(() => {
    if (!isOpen) return;
    if (debouncedSearchQuery !== searchQuery) {
      setSearchQuery(debouncedSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, isOpen]);

  // Clear cached data when API returns empty/null to prevent showing old data
  useEffect(() => {
    if (!isOpen || isFetching || !data) return;
    
    // Check if the latest page is empty/null
    const latestPage = data.pages?.[data.pages.length - 1];
    const isEmptyResponse = Array.isArray(latestPage) && latestPage.length === 0;
    
    // If latest page is empty, reset query data to prevent showing old cached pages
    if (isEmptyResponse) {
      queryClient.setQueryData(['products', debouncedSearchQuery], {
        pages: [[]],
        pageParams: [0],
      });
    }
  }, [data, isOpen, isFetching, debouncedSearchQuery, queryClient]);

  // Flatten all pages into a single array
  // If latest page is empty, only show products from that empty page (i.e., show nothing)
  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    
    const latestPage = data.pages[data.pages.length - 1];
    const isEmptyResponse = Array.isArray(latestPage) && latestPage.length === 0;
    
    // If latest response is empty, don't show any old cached pages
    if (isEmptyResponse) return [];
    
    return data.pages.flat();
  }, [data]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleAdd = () => {
    if (selectedProducts.length === 0) {
      closePicker();
      return;
    }

    const selectedProductsWithDefaults: SelectedProduct[] = selectedProducts.map(
      (product) => ({
        ...product,
        discount: undefined,
        variantDiscounts: {},
        variantsVisible: product.variants.length > 1 ? false : undefined,
      })
    );

    const isEditing = editingProductIndex !== null && editingProductIndex < products.length;

    if (isEditing) {
      replaceProduct(editingProductIndex!, selectedProductsWithDefaults);
    } else {
      selectedProductsWithDefaults.forEach((product) => addProduct(product));
    }

    resetSelection();
    closePicker();
  };

  const handleCancel = () => {
    resetSelection();
    closePicker();
  };

  const getSelectedCount = () => {
    return selectedProducts.reduce(
      (count, product) => count + product.variants.length,
      0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-[#dfe3e8]">
          <DialogTitle className="text-left text-base font-semibold text-[#212b36]">
            Select Products
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-3 border-b border-[#dfe3e8] bg-[#f9fafb]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search product"
              className="pl-10 h-8 text-sm bg-white"
            />
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 min-h-[400px]"
        >
          {allProducts.length === 0 && !isFetching && (
            <div className="text-center text-gray-500 py-8 min-h-[200px] flex items-center justify-center">
              No products found
            </div>
          )}

          {isFetching && !isFetchingNextPage && allProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8 min-h-[200px] flex items-center justify-center">
              Loading...
            </div>
          )}

          {allProducts.map((product) => {
            const allVariantsSelected = product.variants.every((v) =>
              isVariantSelected(product.id, v.id)
            );

            return (
              <div key={product.id} className="mb-4 border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start gap-3 mb-2">
                  <ProductImage
                    src={product.image?.src || DEFAULT_IMAGE}
                    alt={product.title}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Checkbox
                        checked={allVariantsSelected}
                        onCheckedChange={(checked) => {
                          toggleAllVariants(product, checked as boolean);
                        }}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <h3 className="font-medium text-sm">{product.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="ml-9 space-y-2">
                  {product.variants.map((variant) => {
                    const variantSelected = isVariantSelected(
                      product.id,
                      variant.id
                    );
                    return (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Checkbox
                            checked={variantSelected}
                            onCheckedChange={() =>
                              toggleVariantSelection(product, variant.id)
                            }
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <span className="text-gray-700">{variant.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span>99 available</span>
                          <span className="font-medium">${variant.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {isFetchingNextPage && (
            <div className="text-center text-gray-500 py-4">Loading more...</div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-[#6d7175]">
              {getSelectedCount()} product{getSelectedCount() !== 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-8 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                className="h-8 px-4 bg-[#008060] hover:bg-[#006e52] text-white text-sm"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

