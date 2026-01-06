# Tests

This directory contains unit tests for the product discount application using Jest.

## Structure

```
tests/
├── setup.ts              # Test setup and configuration
├── utils/
│   └── test-utils.tsx    # Testing utilities and helpers
├── stores/
│   ├── productStore.test.ts
│   └── pickerStore.test.ts
├── components/
│   └── DiscountInput.test.tsx
└── hooks/
    └── useDebounce.test.ts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Writing Tests

### Store Tests
Store tests use Jest and test Zustand store functionality directly.

Example:
```typescript
// Jest globals are available without import
import { useProductStore } from '@/store/productStore';

describe('productStore', () => {
  beforeEach(() => {
    useProductStore.setState({ products: [] });
  });
  
  it('should add a product', () => {
    // test implementation
  });
});
```

### Component Tests
Component tests use React Testing Library and the custom test utilities.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook Tests
Hook tests use `renderHook` from React Testing Library.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBe(expectedValue);
  });
});
```

## Test Utilities

The `test-utils.tsx` file provides:
- Custom `render` function with QueryClientProvider wrapper
- Re-exported testing utilities from `@testing-library/react`

## Configuration

Test configuration is in `jest.config.js`:
- Uses jsdom environment for DOM testing
- Sets up path aliases for `@/` imports
- Configures test setup file
- Uses ts-jest for TypeScript support

