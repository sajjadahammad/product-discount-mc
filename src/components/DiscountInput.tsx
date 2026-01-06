import type { DiscountType } from '@/types/product';
import { Input } from './ui/input';

interface DiscountInputProps {
  value: number;
  type: DiscountType;
  onChange: (value: number, type: DiscountType) => void;
}

export function DiscountInput({ value, type, onChange }: DiscountInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0, type)}
        className="w-16 h-8 text-sm"
        placeholder="0"
        min="0"
      />
      <select
        value={type}
        onChange={(e) => onChange(value, e.target.value as DiscountType)}
        className="h-8 rounded-md border border-[#c4cdd5] bg-white px-2 text-xs text-[#202223] shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <option value="percentage">% Off</option>
        <option value="flat">Flat Off</option>
      </select>
    </div>
  );
}

