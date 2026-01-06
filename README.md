# Product Discount MC

A React + TypeScript application for managing product discounts with a modern UI built on Vite.

## Installation

Install dependencies using:

```bash
npm install --legacy-peer-deps
```

**Why `--legacy-peer-deps` instead of `npm i`?**

This project uses React 19, but `@testing-library/react@14.3.1` only supports React 18. The `--legacy-peer-deps` flag tells npm to ignore peer dependency conflicts and install anyway. This is safe because React Testing Library is generally compatible with React 19 despite the peer dependency warning.

**Note:** Once `@testing-library/react` releases a version that officially supports React 19, you can switch back to `npm install`.

## Project Structure

```
product-discount-mc/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components (button, input, dialog, checkbox)
│   │   ├── DiscountInput.tsx     # Discount input component
│   │   ├── ProductItem.tsx       # Individual product display
│   │   ├── ProductList.tsx       # Product list container
│   │   ├── ProductPicker.tsx     # Product selection component
│   │   └── VariantItem.tsx       # Product variant display
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDebounce.ts        # Debounce utility hook
│   │   └── useProducts.ts        # Products data fetching hook
│   ├── store/                    # Zustand state management
│   │   ├── pickerStore.ts        # Product picker state
│   │   └── productStore.ts       # Selected products state
│   ├── services/                 # API services
│   │   └── api.ts                # API client and endpoints
│   ├── lib/                      # Utility libraries
│   │   ├── axios.ts              # Axios configuration
│   │   └── utils.ts              # Helper functions
│   ├── types/                    # TypeScript type definitions
│   │   └── product.ts            # Product-related types
│   ├── assets/                   # Static assets
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── tests/                        # Test files
│   ├── components/               # Component tests
│   ├── hooks/                    # Hook tests
│   ├── stores/                   # Store tests
│   ├── utils/                    # Test utilities
│   ├── setup.ts                  # Test setup configuration
│   └── README.md                 # Testing documentation
├── public/                       # Public static assets
├── dist/                         # Build output directory
├── jest.config.cjs               # Jest test configuration
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript root configuration
├── tsconfig.app.json             # TypeScript app configuration
├── tsconfig.test.json            # TypeScript test configuration
├── tsconfig.node.json            # TypeScript Node configuration
├── eslint.config.js              # ESLint configuration
└── package.json                  # Project dependencies and scripts
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
