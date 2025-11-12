declare const $NestedValue: unique symbol;

export declare type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never;
} & TValue;
