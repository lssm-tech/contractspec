import type { DeepOr } from './DeepOr';

export type DeepNullable<T> = DeepOr<T, null>;
