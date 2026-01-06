import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, X, ChevronUp, ChevronDown } from 'lucide-react';
import type { SelectedProduct, DiscountType } from '@/types/product';
import { DiscountInput } from './DiscountInput';
import { VariantItem } from './VariantItem';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Input } from './ui/input';

interface ProductItemProps {
  product: SelectedProduct;
  index: number;
  onEdit: () => void;
  onDiscountChange: (value: number, type: DiscountType) => void;
  onVariantDiscountChange: (
    variantIndex: number,
    value: number,
    type: DiscountType
  ) => void;
  onRemove: () => void;
  onToggleVariants: () => void;
  showRemove: boolean;
}

export function ProductItem({
  product,
  index,
  onEdit,
  onDiscountChange,
  onVariantDiscountChange,
  onRemove,
  onToggleVariants,
  showRemove,
}: ProductItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `product-${product.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasMultipleVariants = product.variants.length > 1;
  const variantsVisible = product.variantsVisible ?? false;

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center py-1">
        <div
          {...attributes}
          {...listeners}
          className="w-6 flex justify-center cursor-grab active:cursor-grabbing text-gray-400"
        >
          <GripVertical className="w-3 h-3" />
        </div>
        <div className="w-6 text-[#6d7175] text-sm">{index + 1}.</div>
        <div className="flex-1 pr-4 relative">
          <Input
            type="text"
            value={product.title}
            readOnly
            className="bg-white h-8 text-sm pr-7"
          />
          <button
            onClick={onEdit}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a6acb2] hover:text-[#008060] transition-colors"
            aria-label="Edit product"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        <div className=" flex items-center justify-end gap-2">
          <DiscountInput
            value={product.discount?.value || 0}
            type={product.discount?.type || 'percentage'}
            onChange={onDiscountChange}
          />
          {showRemove && (
            <button
              onClick={onRemove}
              className="text-[#a6acb2] hover:text-red-500 transition-colors"
              aria-label="Remove product"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {hasMultipleVariants && (
        <div className="pl-12 pb-2 flex justify-end">
          <button
            onClick={onToggleVariants}
            className="text-[#008060] hover:text-[#006e52] text-xs flex items-center gap-1"
          >
            {variantsVisible ? (
              <>
                Hide variants <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show variants <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}

      {hasMultipleVariants && variantsVisible && (
        <div>
          <SortableContext
            items={product.variants.map((v) => `variant-${v.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {product.variants.map((variant, variantIndex) => {
              const variantDiscount = product.variantDiscounts?.[variant.id];
              return (
                <VariantItem
                  key={variant.id}
                  variant={variant}
                  productTitle={product.title}
                  discount={variantDiscount}
                  onDiscountChange={(value, type) =>
                    onVariantDiscountChange(variantIndex, value, type)
                  }
                  showRemove={product.variants.length > 1}
                />
              );
            })}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

