import type { BrowserNativeObject } from './BrowserNativeObject';
import type { IsAny } from './IsAny';
import type { NestedValue } from './NestedValue';
import type { NonUndefined } from './NonUndefined';

export declare type DeepMap<T, TValue> =
  IsAny<T> extends true
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : T extends BrowserNativeObject | NestedValue
      ? TValue
      : T extends object
        ? {
            [K in keyof T]: DeepMap<NonUndefined<T[K]>, TValue>;
          }
        : TValue;
