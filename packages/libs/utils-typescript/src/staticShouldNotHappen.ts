export function staticShouldNotHappen(value: never): asserts value {
  throw new Error(
    `Missing switch value ${(value as null | { toString?: () => string })?.toString?.()}`
  );
}
