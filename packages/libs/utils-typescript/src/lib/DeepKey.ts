export type DeepKey<T, K extends keyof T = keyof T> = K extends string | number
  ? T[K] extends infer R
    ?
        | `${K}`
        | (R extends Record<string, unknown> ? `${K}.${DeepKey<R>}` : never)
    : never // impossible route
  : never; // impossible route
