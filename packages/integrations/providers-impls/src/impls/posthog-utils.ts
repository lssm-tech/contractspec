export function normalizeHost(host: string): string {
  return host.replace(/\/$/, '');
}

export function buildUrl(
  host: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  if (/^https?:\/\//.test(path)) {
    return appendQuery(path, query);
  }
  const normalizedPath = path.replace(/^\/+/, '');
  return appendQuery(`${host}/${normalizedPath}`, query);
}

export function appendQuery(
  url: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    params.set(key, String(value));
  });
  const suffix = params.toString();
  return suffix ? `${url}?${suffix}` : url;
}

export function parseJson<T>(value: string): T {
  if (!value) return {} as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}
