# Typesafe URL Generator

Package for creating typesafe urls

## Getting started

You can install this package via running `npm install typesafe-url-generator` in your local application directory

## Example Usage

```js
// apiConfig.ts
import { createURLGenerator, type URLGeneratorConfig } from 'typesafe-url-generator';

const config = {
  products: {
    environments: {
      local: 'http://localhost:3000',
      development: 'https://dev',
      production: 'https://prod',
    },
    requests: {
      getProducts: '/products',
      getProduct: '/products/:id',
      getProductsByCategory: '/products/category?page=&limit=10',
    },
  },
} as const satisfies URLGeneratorConfig;

export const { generateUrl } = createURLGenerator(
  config,
  'development'
);

// someRequestFile.ts
import { generateUrl } from './apiConfig.ts'

const requestWithParams = generateUrl({
  api: 'products',
  request: 'getProducts',
});

const requestWithParams = generateUrl({
  api: 'products',
  request: 'getProduct',
  replace: {
    id: '1337', // Required
  },
});

const requestWithFilters = generateUrl({
  api: 'products',
  request: 'getProductsByCategory',
  // Optional
  filters: {
    page: '1', // Will be removed from the url if not set
    // limit: '10' Will default to 10 as defined in the config
  },
});
```
