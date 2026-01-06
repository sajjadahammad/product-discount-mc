import type { DiscountType } from '@/types/product';
import { Input } from './ui/input';

interface DiscountInputProps {
  value: number;
  type: DiscountType;
  onChange: (value: number, type: DiscountType) => void;
}

export function DiscountInput({ value, type, onChange }: DiscountInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point, and numbers
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    onChange(Number(numericValue) || 0, type);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        inputMode="numeric"
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-16 h-8 text-sm"
        placeholder="0"
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

