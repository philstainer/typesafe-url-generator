import { expect, test } from "vitest";

import { qUrl } from "./q-url.js";

test("should generate the correct URL for a path param", () => {
  const url = qUrl({ url: "/products/:id", replace: { id: "123" } });
  expect(url).toBe("/products/123");
});

test("should generate the correct URL with filters and defaults", () => {
  const url = qUrl({
    url: "/products?limit=5&search=",
    filters: { search: "test" },
  });
  expect(url).toBe("/products?limit=5&search=test");
});

test("should generate the correct URL without filters", () => {
  const url = qUrl({ url: "/products?limit=5&search=" });
  expect(url).toBe("/products?limit=5");
});

test("should generate the correct URL with includeSearch=false", () => {
  const url = qUrl({
    url: "/products?limit=5&search=",
    filters: { search: "test" },
    includeSearch: false,
  });
  expect(url).toBe("/products");
});

test("should generate the correct URL with filters and replace", () => {
  const url = qUrl({
    url: "/products/:id/list?limit=5&search=",
    filters: { search: "test" },
    replace: { id: "123" },
  });
  expect(url).toBe("/products/123/list?limit=5&search=test");
});

test("should generate the correct URL when passing an array of filters", () => {
  const url = qUrl({
    url: "/products/:id/list?limit=5&search=",
    filters: { search: "test", sort: ["1", "2", "3"] },
    replace: { id: "123" },
  });
  expect(url).toBe(
    "/products/123/list?limit=5&search=test&sort=1&sort=2&sort=3",
  );
});

test("should replace multiple params in the path", () => {
  const url = qUrl({
    url: "/clubs/:clubId/users/:userId",
    replace: { clubId: "c1", userId: "u1" },
  });
  expect(url).toBe("/clubs/c1/users/u1");
});
