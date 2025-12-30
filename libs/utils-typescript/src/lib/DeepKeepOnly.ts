import type { KeepOnly } from './KeepOnly';

export type DeepKeepOnly<T, KeepType> =
  | T
  | (T extends (infer U)[]
      ? KeepOnly<U, KeepType>[]
      : T extends Map<infer K, infer V>
        ? Map<KeepOnly<K, KeepType>, KeepOnly<V, KeepType>>
        : T extends Set<infer M>
          ? Set<KeepOnly<M, KeepType>>
          : KeepOnly<T, KeepType>);
