import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Pencil } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { usePickerStore } from '@/store/pickerStore';
import { ProductItem } from './ProductItem';
import { ProductPicker } from './ProductPicker';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { DiscountType } from '@/types/product';

export function ProductList() {
  const {
    products,
    removeProduct,
    reorderProducts,
    updateProduct,
    updateProductDiscount,
    updateVariantDiscount,
    toggleVariantVisibility,
  } = useProductStore();

  const { openPicker, setSelectionForProduct } = usePickerStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('product-') && overId.startsWith('product-')) {
      const activeIndex = products.findIndex(
        (p) => `product-${p.id}` === activeId
      );
      const overIndex = products.findIndex(
        (p) => `product-${p.id}` === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        reorderProducts(activeIndex, overIndex);
      }
    } else if (
      activeId.startsWith('variant-') &&
      overId.startsWith('variant-')
    ) {
      const activeVariantId = parseInt(activeId.replace('variant-', ''));
      const overVariantId = parseInt(overId.replace('variant-', ''));

      const productIndex = products.findIndex((p) =>
        p.variants.some((v) => v.id === activeVariantId)
      );

      if (productIndex !== -1) {
        const product = products[productIndex];
        const activeVariantIndex = product.variants.findIndex(
          (v) => v.id === activeVariantId
        );
        const overVariantIndex = product.variants.findIndex(
          (v) => v.id === overVariantId
        );

        if (
          activeVariantIndex !== -1 &&
          overVariantIndex !== -1 &&
          activeVariantIndex !== overVariantIndex
        ) {
          const newVariants = [...product.variants];
          const [moved] = newVariants.splice(activeVariantIndex, 1);
          newVariants.splice(overVariantIndex, 0, moved);

          const updatedProduct = {
            ...product,
            variants: newVariants,
          };
          updateProduct(productIndex, updatedProduct);
        }
      }
    }
  };

  const handleAddProduct = () => {
    openPicker(products.length);
    // Don't pre-select existing products when adding - only select when editing
  };

  const handleEditProduct = (index: number) => {
    // Open picker, then seed selection based on the existing product
    openPicker(index);
    const product = products[index];
    if (product) {
      setSelectionForProduct(product);
    }
  };

  const handleRemoveProduct = (index: number) => {
    removeProduct(index);
  };

  const handleProductDiscountChange = (
    index: number,
    value: number,
    type: DiscountType
  ) => {
    updateProductDiscount(index, value, type);
  };

  const handleVariantDiscountChange = (
    productIndex: number,
    variantIndex: number,
    value: number,
    type: DiscountType
  ) => {
    const product = products[productIndex];
    if (product && product.variants[variantIndex]) {
      const variantId = product.variants[variantIndex].id;
      updateVariantDiscount(productIndex, variantId, value, type);
    }
  };

  const handleToggleVariants = (index: number) => {
    toggleVariantVisibility(index);
  };

  const showRemoveButton = products.length > 1;

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="bg-white border-b border-[#dfe3e8]">
        <div className="max-w-5xl mx-auto flex items-center gap-2 px-8 py-4">
          <img
            src="/monk.png"
            alt="Monk"
            className="w-8 h-8 object-cover rounded"
          />
          <h1 className="text-base font-medium text-[#212b36]">
            Monk Upsell & Cross-sell
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white border border-[#dfe3e8] rounded shadow-[0_0_0_1px_rgba(63,63,68,0.05),0_1px_3px_0_rgba(63,63,68,0.15)]">
          <div className="px-6 py-5 border-b border-[#dfe3e8]">
            <h2 className="text-base font-semibold text-[#212b36]">
              Add Products
            </h2>
          </div>

          <div className="px-6 pt-4 pb-2 border-b border-[#dfe3e8] text-xs font-medium text-[#6d7175]">
            <div className="flex items-center">
              <div className="w-6" />
              <div className="w-6" />
              <div className="flex-1">Product</div>
              <div className="w-[230px] text-right pr-2">Discount</div>
            </div>
          </div>

          <div className="px-6 py-3">
            {products.length === 0 ? (
              <div className="flex items-center py-1">
                <div className="w-6 flex justify-center text-gray-400">
                  <GripVertical className="w-3 h-3" />
                </div>
                <div className="w-6 text-[#6d7175] text-sm">1.</div>
                <div className="flex-1 pr-4 relative">
                  <Input
                    type="text"
                    placeholder="Select Product"
                    readOnly
                    onClick={handleAddProduct}
                    className="cursor-pointer h-8 text-sm"
                  />
                  <button
                    onClick={handleAddProduct}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#a6acb2] hover:text-[#008060] transition-colors"
                    aria-label="Edit product"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-[230px] flex justify-end">
                  <Button
                    onClick={handleAddProduct}
                    className="h-8 px-3 bg-[#008060] hover:bg-[#006e52] text-white text-sm"
                  >
                    Add Discount
                  </Button>
                </div>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={products.map((p) => `product-${p.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {products.map((product, index) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        index={index}
                        onEdit={() => handleEditProduct(index)}
                        onDiscountChange={(value, type) =>
                          handleProductDiscountChange(index, value, type)
                        }
                        onVariantDiscountChange={(variantIndex, value, type) =>
                          handleVariantDiscountChange(
                            index,
                            variantIndex,
                            value,
                            type
                          )
                        }
                        onRemove={() => handleRemoveProduct(index)}
                        onToggleVariants={() => handleToggleVariants(index)}
                        showRemove={showRemoveButton}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="px-6 pb-5 pt-1 border-t border-[#dfe3e8]">
            <div className="flex justify-center">
              <Button
                onClick={handleAddProduct}
                variant="outline"
                className="h-9 px-6 border border-[#008060] text-[#008060] hover:bg-[#f0fdf7] text-sm font-medium rounded"
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProductPicker />
    </div>
  );
}

