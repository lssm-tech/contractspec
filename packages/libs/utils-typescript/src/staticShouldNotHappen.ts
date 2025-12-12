export const staticShouldNotHappen: (value: never) => asserts value = (
  value: never
) => {
  throw new Error(
    `Missing switch value ${(value as null | { toString?: () => string })?.toString?.()}`
  );
};
