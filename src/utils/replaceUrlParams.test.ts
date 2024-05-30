import { expect, test } from "vitest";

import { replaceUrlParams } from "./replaceUrlParams";

const baseUrl = "https://example.com";

test("should replace URL parameters", () => {
  const url = `${baseUrl}/user/:userId/book/:bookId`;
  const replace = { userId: "123", bookId: "456" };
  const expectedUrl = `${baseUrl}/user/${replace.userId}/book/${replace.bookId}`;
  expect(replaceUrlParams({ url, replace })).toBe(expectedUrl);
});

test("should replace URL parameter segment", () => {
  const url = `${baseUrl}/user/:userId/book/:bookId:.jpeg`;
  const replace = { userId: "123", bookId: "456" };
  const expectedUrl = `${baseUrl}/user/${replace.userId}/book/${replace.bookId}.jpeg`;
  expect(replaceUrlParams({ url, replace })).toBe(expectedUrl);
});

test("should ignore missing parameters", () => {
  const url = `${baseUrl}/user/:userId/book/:bookId`;
  const replace = { userId: "123" };
  const expectedUrl = `${baseUrl}/user/${replace.userId}/book/:bookId`;
  expect(replaceUrlParams({ url, replace })).toBe(expectedUrl);
});

test("should handle empty parameter values", () => {
  const url = `${baseUrl}/user/:userId/book/:bookId`;
  const replace = { userId: "", bookId: "456" };
  const expectedUrl = `${baseUrl}/user/:userId/book/${replace.bookId}`;
  expect(replaceUrlParams({ url, replace })).toBe(expectedUrl);
});

test("should handle missing parameters", () => {
  const url = `${baseUrl}/user/:userId/book/:bookId`;
  const replace = {};
  const expectedUrl = `${baseUrl}/user/:userId/book/:bookId`;
  expect(replaceUrlParams({ url, replace })).toBe(expectedUrl);
});
