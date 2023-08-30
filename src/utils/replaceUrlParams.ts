export const replaceUrlParams = ({
  url,
  replace,
}: {
  url: string;
  replace: Record<string, string>;
}) => {
  let replacedUrl = url;

  Object.entries(replace).forEach(([key, value]) => {
    if (!value) return;

    replacedUrl = replacedUrl
      .replace(`:${key}:`, value)
      .replace(`:${key}`, value);
  });

  return replacedUrl;
};
