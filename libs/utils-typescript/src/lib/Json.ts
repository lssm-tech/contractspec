export declare type PrimitiveJSONValue =
  | string
  | number
  | boolean
  | undefined
  | null;
export declare type JSONValue = PrimitiveJSONValue | JSONArray | JSONObject;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface JSONArray extends Array<JSONValue> {}

export interface JSONObject {
  [key: string]: JSONValue;
}

export declare type NonJsonValue<ExtraTypes> =
  | PrimitiveJSONValue
  | NonJsonArray<ExtraTypes>
  | NonJsonObject<ExtraTypes>
  | ExtraTypes;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NonJsonArray<ExtraTypes> extends Array<
  NonJsonValue<ExtraTypes>
> {}

export interface NonJsonObject<ExtraTypes> {
  [key: string]: NonJsonValue<ExtraTypes>;
}

export type ExtendedJsonObject = NonJsonObject<bigint | Date>;
