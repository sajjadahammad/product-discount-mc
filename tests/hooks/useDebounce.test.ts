// Jest globals are available without import
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    jest.advanceTimersByTime(500);

    // Wait for the debounced value to update
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Rapid changes
    rerender({ value: 'change1', delay: 500 });
    jest.advanceTimersByTime(200);

    rerender({ value: 'change2', delay: 500 });
    jest.advanceTimersByTime(200);

    rerender({ value: 'change3', delay: 500 });
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe('change3');
    });

    // Should not have intermediate values
    expect(result.current).not.toBe('change1');
    expect(result.current).not.toBe('change2');
  });

  it('should handle number values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 300 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 100, delay: 300 });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe(100);
    });
  });
});

