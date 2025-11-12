export type DeepReplace<T, Search, Replace> = T extends (infer ArrayItemT)[]
  ? DeepReplace<ArrayItemT, Search, Replace>[]
  : T extends Map<infer MapKey, infer MapT>
    ? Map<
        DeepReplace<MapKey, Search, Replace>,
        DeepReplace<MapT, Search, Replace>
      >
    : T extends Set<infer SetT>
      ? Set<DeepReplace<SetT, Search, Replace>>
      : T extends object
        ? {
            [ObjKey in keyof T]: DeepReplace<T[ObjKey], Search, Replace>;
          }
        : T extends Search
          ? Replace
          : T;
