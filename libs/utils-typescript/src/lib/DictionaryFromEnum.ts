export type DictionaryFromEnum<Enum, ObjMapping> = Record<
  keyof Enum,
  ObjMapping
>;
