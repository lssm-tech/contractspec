import type { DeepReplace } from './DeepReplace';

export type DeepReplaceNullByUndefined<T> = DeepReplace<T, null, undefined>;
