// Jest globals are available without import
import { render, screen } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { DiscountInput } from '@/components/DiscountInput';

describe('DiscountInput', () => {
  it('should render with initial value', () => {
    const mockOnChange = jest.fn();
    render(<DiscountInput value={20} type="percentage" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    expect(input.value).toBe('20');
  });

  it('should call onChange when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<DiscountInput value={0} type="percentage" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('0');
    await user.clear(input);
    await user.type(input, '25');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should display percentage type in select', () => {
    const mockOnChange = jest.fn();
    render(<DiscountInput value={10} type="percentage" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('percentage');
  });

  it('should display flat type in select', () => {
    const mockOnChange = jest.fn();
    render(<DiscountInput value={10} type="flat" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('flat');
  });

  it('should call onChange when discount type changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<DiscountInput value={10} type="percentage" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'flat');

    expect(mockOnChange).toHaveBeenCalledWith(10, 'flat');
  });

  it('should have both discount type options', () => {
    const mockOnChange = jest.fn();
    render(<DiscountInput value={0} type="percentage" onChange={mockOnChange} />);

    expect(screen.getByText('% Off')).toBeInTheDocument();
    expect(screen.getByText('Flat Off')).toBeInTheDocument();
  });

  it('should handle empty value', () => {
    const mockOnChange = jest.fn();
    render(<DiscountInput value={0} type="percentage" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});

