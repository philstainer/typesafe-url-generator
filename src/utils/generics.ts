/** biome-ignore-all lint/complexity/noBannedTypes: It works as expected */

export type NonEmptyObject<T> = T extends {}
  ? keyof T extends never
    ? never
    : T
  : never;

export type OptionalParam<
  TCompare,
  TValue,
  TReturn = object
> = TCompare | null extends null ? TReturn : TValue;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
