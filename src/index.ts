import { replaceUrlParams } from "./utils//replaceUrlParams.js";
import { replaceUrlSearchParams } from "./utils/replaceUrlSearchParams.js";
import type {
  Environment,
  GenerateUrlProps,
  URLGeneratorConfig,
} from "./types.js";

export const createURLGenerator = <TConfig extends URLGeneratorConfig>(
  config: TConfig,
  configEnvironment: (() => Environment) | Environment,
) => {
  const generateUrl = <
    TApi extends keyof TConfig,
    TRequest extends keyof TConfig[TApi]["requests"],
    TPath extends TConfig[TApi]["requests"][TRequest] extends string
      ? TConfig[TApi]["requests"][TRequest]
      : never,
    TInclude extends boolean = true,
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
