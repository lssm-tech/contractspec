export type KeepOnly<T, KeepType> = T extends object
  ? {
      [K in keyof T]: KeepOnly<T[K], KeepType>;
    }
  : T extends KeepType
    ? T
    : never;
