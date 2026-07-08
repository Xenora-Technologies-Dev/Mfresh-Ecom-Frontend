export async function withDemoFallback<T>(
  fn: () => Promise<T>,
  fallback: T,
  options?: { emptyArrayFallback?: boolean },
): Promise<T> {
  try {
    const result = await fn();
    if (
      options?.emptyArrayFallback &&
      Array.isArray(result) &&
      result.length === 0
    ) {
      return fallback;
    }
    return result;
  } catch {
    return fallback;
  }
}
