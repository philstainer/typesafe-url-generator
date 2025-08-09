/** biome-ignore-all lint/correctness/noUnusedVariables: We want to ignore unused variables in this file */
/** biome-ignore-all lint/complexity/noBannedTypes: It works as expected */

import type { NonEmptyObject, OptionalParam, Prettify } from "./utils/generics.js";
import { replaceUrlParams } from "./utils//replaceUrlParams.js";
import { replaceUrlSearchParams } from "./utils/replaceUrlSearchParams.js";

// --- Params
type ParamOnly<Segment extends string> =
  Segment extends `:${infer Param}:${infer Param2}`
    ? { [Key in Param]: string }
    : Segment extends `:${infer Param}`
    ? { [Key in Param]: string }
    : {};

type PathSegment<Path extends string> =
  Path extends `${infer SegmentA}/${infer SegmentB}`
    ? ParamOnly<SegmentA> & PathSegment<SegmentB>
    : ParamOnly<Path>;

type PathSegments<Path extends string> =
  Path extends `${infer SegmentA}?${infer SegmentB}`
    ? PathSegment<SegmentA>
    : PathSegment<Path>;

type RouteParams<Path extends string> = PathSegments<Path> extends never
  ? {}
  : PathSegments<Path>;

// --- Search
type IsSearchParam<SearchParam extends string> =
  SearchParam extends `${infer ParamName}=${infer ParamValue}`
    ? { [Key in ParamName]?: string | string[] }
    : {};

type SearchSegment<Path extends string> =
  Path extends `${infer FirstSearchParam}&${infer OtherSearchParams}`
    ? IsSearchParam<FirstSearchParam> & SearchSegment<OtherSearchParams>
    : IsSearchParam<Path>;

type SearchSegments<Path extends string> =
  Path extends `${infer Url}?${infer SearchParams}`
    ? SearchSegment<SearchParams>
    : never;

type OptionalRouteParams<Path extends string> =
  SearchSegments<Path> extends never ? {} : SearchSegments<Path>;

// --- Props
type ReplaceProp<TPath extends string> = OptionalParam<
  NonEmptyObject<RouteParams<TPath>>,
  { replace: Prettify<RouteParams<TPath>> }
>;

type GenerateUrlProps<TApi, TRequest, TPath extends string, TInclude> = {
  api: TApi;
  request: TRequest;
  includeBase?: TInclude;
  filters?: Prettify<OptionalRouteParams<TPath>> &
    Record<string, string | string[]>;
} & ReplaceProp<TPath> &
  (TInclude extends false ? object : { environment?: Environment });

// --- Function
type Environments = {
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

export const createURLGenerator = <TConfig extends URLGeneratorConfig>(
  config: TConfig,
  configEnvironment: (() => Environment) | Environment
) => {
  const generateUrl = <
    TApi extends keyof TConfig,
    TRequest extends keyof TConfig[TApi]["requests"],
    TPath extends TConfig[TApi]["requests"][TRequest] extends string
      ? TConfig[TApi]["requests"][TRequest]
      : never,
    TInclude extends boolean = true
  >({
    api,
    request: incomingRequest,
    ...other
  }: GenerateUrlProps<TApi, TRequest, TPath, TInclude>) => {
    const defaultReplacementsAndFilters = {
      replace: {},
      filters: {},
      environment:
        typeof configEnvironment === "function"
          ? configEnvironment()
          : configEnvironment,
      includeBase: true,
    };

    const { replace, filters, environment, includeBase } = {
      ...defaultReplacementsAndFilters,
      ...other,
    };

    const requests = config[api].requests;
    const request = requests[
      incomingRequest as keyof typeof requests
    ] as string;

    let url = request;

    if (includeBase) {
      if (!config[api].environments[environment])
        throw new Error(`Environment ${environment} not found in config`);

      const baseUrl = config[api].environments[environment];

      url = `${baseUrl}${request}`;
    }

    if (Object.keys(replace).length > 0)
      url = replaceUrlParams({ url, replace });
    url = replaceUrlSearchParams({ url, filters });

    return url;
  };

  return { generateUrl };
};
