/** biome-ignore-all lint/complexity/noBannedTypes: ignored */

import { assertType, test } from "vitest";

import { qUrl } from "./q-url.js";

test("should require replace object with key of id", () => {
  type ProductArgs = Parameters<
    typeof qUrl<"/products/:id", { id: string }>
  >[0];

  // @ts-expect-error - should error when required param is not passed
  assertType<ProductArgs>({ url: "/products/:id" });

  assertType<ProductArgs>({
    url: "/products/:id",
    // @ts-expect-error - should error when non existing param is passed
    replace: { nonExistingParam: "boom" },
  });

  assertType<ProductArgs>({
    url: "/products/:id",
    replace: { id: "2" },
    filters: { limit: "5" },
  });
});

test("should have optional filters inferred from search params", () => {
  type ProductsArgs = Parameters<
    typeof qUrl<"/products?limit=5&search=", {}>
  >[0];

  assertType<ProductsArgs>({
    url: "/products?limit=5&search=",
    // @ts-expect-error - should error when non existing path param is passed in replace
    replace: { nonExistingParam: "boom" },
  });

  assertType<ProductsArgs>({ url: "/products?limit=5&search=" });

  assertType<ProductsArgs>({
    url: "/products?limit=5&search=",
    filters: { limit: "5", nonExistingParam: "happy" },
  });

  assertType<ProductsArgs>({
    url: "/products?limit=5&search=",
    filters: { limit: ["1", "5"], nonExistingParam: ["i", "am", "happy"] },
  });
});

test("should reflect includeSearch=false type by removing query string", () => {
  // With includeSearch default true, result contains query string in type
  const withSearch = qUrl({ url: "/a?b=" });
  assertType<"/a?b=">(withSearch);

  // With includeSearch as false, final type should drop search params
  const withoutSearch = qUrl({ url: "/a?b=", includeSearch: false });
  assertType<"/a">(withoutSearch);
});
