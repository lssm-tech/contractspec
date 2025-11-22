export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = true
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    await new Promise((resolve) => setTimeout(resolve, delay));

    return retry(fn, retries - 1, backoff ? delay * 2 : delay, backoff);
  }
}



