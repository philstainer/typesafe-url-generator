import { assertType, test } from "vitest";

import { createURLGenerator, type URLGeneratorConfig } from "./";

const apiConfig = {
  products: {
    environments: {
      local: "",
      development: "http://localhost:3000",
      production: "",
    },
    requests: {
      product: "/products/:id",
      products: "/products?limit=5&search=",
    },
  },
} as const satisfies URLGeneratorConfig; // Satisfies requires typescript version >= 5

const { generateUrl } = createURLGenerator(apiConfig, "development");

test("should require replace object with key of id", () => {
  type productArgs = Parameters<
    typeof generateUrl<
      "products",
      "product",
      typeof apiConfig.products.requests.product
    >
  >[0];

  // @ts-expect-error - should error when required param is not passed
  assertType<productArgs>({
    api: "products",
    request: "product",
  });

  assertType<productArgs>({
    api: "products",
    request: "product",
    // @ts-expect-error - should error when non existing param is passed
    replace: { nonExistingParam: "boom" },
  });

  assertType<productArgs>({
    api: "products",
    request: "product",
    replace: { id: "2" },
    filters: { limit: "5" },
  });
});

test("should require replace object and have optional filters", () => {
  type productArgs = Parameters<
    typeof generateUrl<
      "products",
      "products",
      typeof apiConfig.products.requests.products
    >
  >[0];

  assertType<productArgs>({
    api: "products",
    request: "products",
    // @ts-expect-error - should error when required param is not passed
    replace: { nonExistingParam: "boom" },
  });

  assertType<productArgs>({
    api: "products",
    request: "products",
  });

  assertType<productArgs>({
    api: "products",
    request: "products",
    filters: { limit: "5", nonExistingParam: "happy" },
  });

  assertType<productArgs>({
    api: "products",
    request: "products",
    filters: { limit: ["1", "5"], nonExistingParam: ["i", "am", "happy"] },
  });
});

test("should error when request doesn't exist", () => {
  type productArgs = Parameters<typeof generateUrl>[0];

  assertType<productArgs>({
    api: "products",
    // @ts-expect-error - should error when request doesn't exist
    request: "nonExistingRequest",
  });
});
