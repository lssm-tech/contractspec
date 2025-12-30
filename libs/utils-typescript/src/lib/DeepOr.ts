export type DeepOr<T, OrValue> =
  | T
  | (T extends (infer U)[]
      ? DeepOr<U, OrValue>[]
      : T extends Map<infer K, infer V>
        ? Map<DeepOr<K, OrValue>, DeepOr<V, OrValue>>
        : T extends Set<infer M>
          ? Set<DeepOr<M, OrValue>>
          : T extends object
            ? {
                [K in keyof T]: DeepOr<T[K], OrValue> | OrValue;
              }
            : T);
