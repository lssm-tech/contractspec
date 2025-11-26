export async function fallback<T>(
  fn: () => Promise<T>,
  fallbackValue: T | (() => Promise<T>)
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (fallbackValue instanceof Function) {
      return await fallbackValue();
    }
    return fallbackValue;
  }
}










