import { expect, test } from "vitest";

import { createURLGenerator, type URLGeneratorConfig } from "./index";

const apiConfig = {
  products: {
    environments: {
      local: "http://localhost:5000",
      development: "http://localhost:3000",
      production: "",
    },
    requests: {
      product: "/products/:id",
      products: "/products?limit=5&search=",
      productWithFilter: "/products/:id/list?limit=5&search=",
    },
  },
} as const satisfies URLGeneratorConfig; // Satisfies requires typescript version >= 5

const { generateUrl } = createURLGenerator(apiConfig, "development");

test("should generate the correct URL for a product request", () => {
  const url = generateUrl({
    api: "products",
    request: "product",
    replace: { id: "123" },
  });
  expect(url).toBe("http://localhost:3000/products/123");
});

test("should generate the correct URL for a products request with filters and defaults", () => {
  const url = generateUrl({
    api: "products",
    request: "products",
    filters: { search: "test" },
  });
  expect(url).toBe("http://localhost:3000/products?limit=5&search=test");
});

test("should generate the correct URL for a products request without filters", () => {
  const url = generateUrl({
    api: "products",
    request: "products",
  });
  expect(url).toBe("http://localhost:3000/products?limit=5");
});

test("should generate the correct URL for a products request with environment", () => {
  const url = generateUrl({
    api: "products",
    request: "products",
    environment: "local",
  });
  expect(url).toBe("http://localhost:5000/products?limit=5");
});

test("should generate the correct URL for a products request with includeBase=false", () => {
  const url = generateUrl({
    api: "products",
    request: "products",
    includeBase: false,
  });
  expect(url).toBe("/products?limit=5");
});

test("should generate the correct URL for a products request with filters and replace", () => {
  const url = generateUrl({
    api: "products",
    request: "productWithFilter",
    filters: { search: "test" },
    replace: { id: "123" },
  });
  expect(url).toBe(
    "http://localhost:3000/products/123/list?limit=5&search=test"
  );
});
