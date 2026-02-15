import { type FieldType } from './FieldType';

type ScalarFactory = () => FieldType<unknown, unknown>;

/**
 * Wrap scalar factories with per-key instance caching.
 *
 * Each scalar constructor remains lazy, but repeated calls return
 * the same FieldType instance for a given scalar name.
 */
export const createCachedScalarFactories = <
  T extends Record<string, ScalarFactory>,
>(
  factories: T
): { [K in keyof T]: T[K] } => {
  const cache = new Map<keyof T, FieldType<unknown, unknown>>();

  return Object.fromEntries(
    (Object.entries(factories) as [keyof T, ScalarFactory][]).map(
      ([name, factory]) => [
        name,
        () => {
          const cached = cache.get(name);
          if (cached) {
            return cached;
          }

          const instance = factory();
          cache.set(name, instance);
          return instance;
        },
      ]
    )
  ) as {
    [K in keyof T]: T[K];
  };
};
