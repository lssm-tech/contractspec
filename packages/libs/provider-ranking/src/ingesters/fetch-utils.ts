/**
 * Fetch helper with retry and exponential backoff for ingester robustness.
 */

interface FetchWithRetryOptions {
  fetch?: typeof globalThis.fetch;
  maxRetries?: number;
  baseDelayMs?: number;
}

export async function fetchWithRetry(
  url: string,
  options?: FetchWithRetryOptions
): Promise<Response> {
  const fetchFn = options?.fetch ?? globalThis.fetch;
  const maxRetries = options?.maxRetries ?? 2;
  const baseDelay = options?.baseDelayMs ?? 500;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchFn(url);
      if (response.ok) return response;

      if (response.status >= 500 && attempt < maxRetries) {
        await sleep(baseDelay * Math.pow(2, attempt));
        continue;
      }

      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText} (${url})`
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        await sleep(baseDelay * Math.pow(2, attempt));
      }
    }
  }

  throw (
    lastError ??
    new Error(`Fetch failed after ${maxRetries + 1} attempts: ${url}`)
  );
}

export function parseJsonSafe<T>(text: string, label: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Failed to parse JSON response from ${label}: ${text.slice(0, 200)}`
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
