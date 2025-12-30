export type DictionaryFromEnumMapping<
  Enum,
  Mapped,
  Mapping extends Record<keyof Enum, Mapped>,
> = {
  [k in keyof Enum]: Mapping[k];
};
