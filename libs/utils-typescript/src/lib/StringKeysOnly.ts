import type { StringKey } from './StringKey';

export type StringKeysOnly<T> = Pick<T, StringKey<T>>;
