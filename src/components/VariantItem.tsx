import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import type { Variant, DiscountType } from '@/types/product';
import { DiscountInput } from './DiscountInput';
import { Input } from './ui/input';

interface VariantItemProps {
  variant: Variant;
  productTitle: string;
  discount?: { value: number; type: DiscountType };
  onDiscountChange: (value: number, type: DiscountType) => void;
  onRemove?: () => void;
  showRemove: boolean;
}

export function VariantItem({
  variant,
  productTitle,
  discount,
  onDiscountChange,
  onRemove,
  showRemove,
}: VariantItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `variant-${variant.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center py-1 pl-12"
    >
      <div
        {...attributes}
        {...listeners}
        className="w-6 flex justify-center cursor-grab active:cursor-grabbing text-gray-400"
      >
        <GripVertical className="w-3 h-3" />
      </div>
      <div className="flex-1 pr-4">
        <Input
          type="text"
          value={productTitle}
          readOnly
          className="bg-white h-8 text-sm"
        />
      </div>
      <div className="w-[230px] flex items-center justify-end gap-2">
        <DiscountInput
          value={discount?.value || 0}
          type={discount?.type || 'percentage'}
          onChange={onDiscountChange}
        />
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove variant"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

