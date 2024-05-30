import { expect, test } from "vitest";

import { replaceUrlSearchParams } from "./replaceUrlSearchParams";

const baseUrl = "https://example.com";

test("should replace URL search parameters", () => {
  const url = `${baseUrl}/users/book?name=&age=`;
  const filters = { name: "123", age: "18" };
  const expectedUrl = `${baseUrl}/users/book?name=${filters.name}&age=${filters.age}`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});

test("should ignore missing parameters", () => {
  const url = `${baseUrl}/users/book?name=&age=`;
  const filters = { name: "123" };
  const expectedUrl = `${baseUrl}/users/book?name=${filters.name}`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});

test("should handle empty parameter values", () => {
  const url = `${baseUrl}/users/book?name=&age=`;
  const filters = { name: "", age: "18" };
  const expectedUrl = `${baseUrl}/users/book?age=${filters.age}`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});

test("should handle missing parameters", () => {
  const url = `${baseUrl}/users/book?name=&age=`;
  const filters = {};
  const expectedUrl = `${baseUrl}/users/book`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});

test("should handle default parameters", () => {
  const url = `${baseUrl}/users/book?name=&age=18`;
  const filters = {};
  const expectedUrl = `${baseUrl}/users/book?age=18`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});

test("should handle passing filter as an array of strings", () => {
  const url = `${baseUrl}/users/book?name=&age=18`;
  const filters = { sort: ["1", "2", "3"] };
  const expectedUrl = `${baseUrl}/users/book?age=18&sort=1&sort=2&sort=3`;
  expect(replaceUrlSearchParams({ url, filters })).toBe(expectedUrl);
});
