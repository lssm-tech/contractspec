import type { DeepKey } from './DeepKey';

export type DeepValue<
  T,
  P extends DeepKey<T>,
> = P extends `${infer K}.${infer Rest}`
  ? T[(K extends `${infer R extends number}` ? R : K) & keyof T] extends infer S
    ? S extends never // make S distributive to work with union object
      ? never
      : Rest extends DeepKey<S>
        ? DeepValue<S, Rest>
        : never // impossible route
    : never // impossible route
  : T[(P extends `${infer R extends number}` ? R : P) & keyof T];
