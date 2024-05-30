export const replaceUrlSearchParams = ({
  url: incomingUrl,
  filters,
}: {
  url: string;
  filters: Record<string, string | string[]>;
}) => {
  const [url, search] = incomingUrl.split("?");

  const params = new URLSearchParams(search ?? {});

  // Set params using filters
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (!Array.isArray(value)) return params.set(key, value);

    value.forEach((v) => {
      params.append(key, v);
    });
  });

  // Remove empty params
  [...params.entries()].forEach(([key, value]) => {
    if (!value) params.delete(key, "");
  });

  const searchParams = params.toString();

  if (!searchParams) return url;

  return `${url}?${searchParams}`;
};
