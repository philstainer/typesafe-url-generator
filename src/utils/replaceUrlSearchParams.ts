export const replaceUrlSearchParams = ({
  url: incomingUrl,
  filters,
}: {
  url: string;
  filters: Record<string, string>;
}) => {
  const [url, search] = incomingUrl.split("?");

  const params = new URLSearchParams(search ?? {});

  // Set params using filters
  Object.entries(filters).forEach(([key, value]) => params.set(key, value));

  // Remove empty params
  [...params.entries()].forEach(([key, value]) => {
    if (!value) params.delete(key);
  });

  const searchParams = params.toString();

  if (!searchParams) return url ?? "";

  return `${url}?${searchParams}`;
};
