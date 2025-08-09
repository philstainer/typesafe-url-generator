/** biome-ignore-all lint/correctness/noUnusedVariables: We want to ignore unused variables in this file */
/** biome-ignore-all lint/complexity/noBannedTypes: It works as expected */

import type {
  NonEmptyObject,
  OptionalParam,
  Prettify,
} from "./utils/generics.js";

// --- Params
export type ParamOnly<Segment extends string> =
  Segment extends `:${infer Param}:${infer Param2}`
    ? { [Key in Param]: string }
    : Segment extends `:${infer Param}`
      ? { [Key in Param]: string }
      : {};

export type PathSegment<Path extends string> =
  Path extends `${infer SegmentA}/${infer SegmentB}`
    ? ParamOnly<SegmentA> & PathSegment<SegmentB>
    : ParamOnly<Path>;

export type PathSegments<Path extends string> =
  Path extends `${infer SegmentA}?${infer SegmentB}`
    ? PathSegment<SegmentA>
    : PathSegment<Path>;

export type RouteParams<Path extends string> = PathSegments<Path> extends never
  ? {}
  : PathSegments<Path>;

// --- Search
export type IsSearchParam<SearchParam extends string> =
  SearchParam extends `${infer ParamName}=${infer ParamValue}`
    ? { [Key in ParamName]?: string | string[] }
    : {};

export type SearchSegment<Path extends string> =
  Path extends `${infer FirstSearchParam}&${infer OtherSearchParams}`
    ? IsSearchParam<FirstSearchParam> & SearchSegment<OtherSearchParams>
    : IsSearchParam<Path>;

export type SearchSegments<Path extends string> =
  Path extends `${infer Url}?${infer SearchParams}`
    ? SearchSegment<SearchParams>
    : never;

export type OptionalRouteParams<Path extends string> =
  SearchSegments<Path> extends never ? {} : SearchSegments<Path>;

// --- Props
export type ReplaceProp<TPath extends string> = OptionalParam<
  NonEmptyObject<RouteParams<TPath>>,
  { replace: Prettify<RouteParams<TPath>> }
>;

export type GenerateUrlProps<TApi, TRequest, TPath extends string, TInclude> = {
  api: TApi;
  request: TRequest;
  includeBase?: TInclude;
  filters?: Prettify<OptionalRouteParams<TPath>> &
    Record<string, string | string[]>;
} & ReplaceProp<TPath> &
  (TInclude extends false ? object : { environment?: Environment });

// --- Function
export type Environments = {
  local: string;
  development: string;
  preprod?: string;
  production: string;
};

export type Environment = keyof Environments;

export type URLGeneratorConfig = Record<
  string,
  {
    environments: Environments;
    requests: Record<string, string>;
  }
>;

export type RemoveSearchParams<T> = T extends `${infer Base}?${infer _Rest}`
  ? Base
  : T;

type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type EncodeSpaces<S extends string> = S extends `${infer H} ${infer T}`
  ? `${EncodeSpaces<H>}%20${EncodeSpaces<T>}`
  : S;

type Sanitize<V extends string> = EncodeSpaces<Trim<V>>;

type ReplaceAllOnce<
  S extends string,
  K extends string,
  V extends string,
> = S extends `${infer H}:${K}:${infer T}`
  ? `${H}${V}${T}`
  : S extends `${infer H}:${K}${infer T}`
    ? `${H}${V}${T}`
    : S;

type ReplaceAll<
  S extends string,
  K extends string,
  V extends string,
> = S extends `${string}:${K}:${string}` | `${string}:${K}${string}`
  ? ReplaceAll<ReplaceAllOnce<S, K, V>, K, V>
  : S;

type Entries<R extends Record<string, string>> = {
  [K in keyof R]-?: [K & string, R[K] & string];
}[keyof R];

type ReplaceEntries<S extends string, E> = [E] extends [never]
  ? S
  : E extends [infer K extends string, infer V extends string]
    ? ReplaceEntries<ReplaceAll<S, K, Sanitize<V>>, Exclude<E, [K, V]>>
    : S;

type ReplaceInPath<
  TUrl extends string,
  TReplace extends Record<string, string>,
> = TUrl extends `${infer P}?${infer QS}`
  ? `${ReplaceEntries<P, Entries<TReplace>>}?${QS}`
  : ReplaceEntries<TUrl, Entries<TReplace>>;

export type FinalUrl<
  TUrl extends string,
  TReplace extends Record<string, string>,
> = ReplaceInPath<TUrl, TReplace>;
