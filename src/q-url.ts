import type {
  FinalUrl,
  OptionalRouteParams,
  RemoveSearchParams,
  RouteParams,
} from "./types.js";
import type {
  NonEmptyObject,
  OptionalParam,
  Prettify,
} from "./utils/generics.js";
import { replaceUrlParams } from "./utils/replaceUrlParams.js";
import { replaceUrlSearchParams } from "./utils/replaceUrlSearchParams.js";

type ReplaceProp<TReplace, TPath extends string> = OptionalParam<
  NonEmptyObject<RouteParams<TPath>>,
  { replace: Prettify<TReplace & RouteParams<TPath>> }
>;

export const qUrl = <
  TUrl extends string,
  TReplace extends Record<string, string>,
  SInclude extends boolean = true,
>({
  url: incomingUrl,
  ...args
}: {
  url: TUrl;
  includeSearch?: SInclude;
  filters?: Prettify<OptionalRouteParams<TUrl>> &
    Record<string, string | string[]>;
} & ReplaceProp<TReplace, TUrl>): SInclude extends true
  ? FinalUrl<TUrl, TReplace>
  : RemoveSearchParams<TUrl> => {
  const defaultReplacementsAndFilters = {
    replace: {},
    filters: {},
    includeSearch: true,
  };

  const { replace, filters, includeSearch } = {
    ...defaultReplacementsAndFilters,
    ...args,
  };

  let url: string = incomingUrl;

  if (Object.keys(replace).length > 0) url = replaceUrlParams({ url, replace });
  url = replaceUrlSearchParams({ url, filters });

  const finalUrl = includeSearch ? url : url.split("?")[0];

  return finalUrl as unknown as SInclude extends true
    ? FinalUrl<TUrl, TReplace>
    : RemoveSearchParams<TUrl>;
};
