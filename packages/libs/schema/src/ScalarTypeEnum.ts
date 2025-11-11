import { z } from 'zod';
import { type GraphQLScalarTypeConfig, Kind, type ValueNode } from 'graphql';
import { FieldType } from './FieldType';

// Helpers to build standard scalars
const localeRegex = /^[A-Za-z]{2}(?:-[A-Za-z0-9]{2,8})*$/;
const timezoneRegex = /^(?:UTC|[A-Za-z_]+\/[A-Za-z_]+)$/;
const phoneRegex = /^[+]?\d[\d\s().-]{3,}$/;
const currencyRegex = /^[A-Z]{3}$/;
const countryRegex = /^[A-Z]{2}$/;
const latMin = -90;
const latMax = 90;
const lonMin = -180;
const lonMax = 180;

/**
 * Factory functions for common scalar FieldTypes with zod/GraphQL/JSON Schema.
 */
export const ScalarTypeEnum = {
  // primitives (_unsecure)
  String_unsecure: (): FieldType<string> =>
    new FieldType<string>({
      name: 'String_unsecure',
      description: 'Unvalidated string scalar',
      zod: z.string(),
      parseValue: (v) => z.string().parse(v),
      serialize: (v) => String(v),
      parseLiteral: (ast: ValueNode) => {
        if (ast.kind !== Kind.STRING) throw new TypeError('Invalid literal');
        return ast.value;
      },
      jsonSchema: { type: 'string' },
    }),
  Int_unsecure: (): FieldType<number> =>
    new FieldType<number>({
      name: 'Int_unsecure',
      description: 'Unvalidated integer scalar',
      zod: z.number().int(),
      parseValue: (v) => {
        const num = typeof v === 'number' ? v : Number(v as unknown);
        return z.number().int().parse(num);
      },
      serialize: (v) => Math.trunc(typeof v === 'number' ? v : Number(v)),
      parseLiteral: (ast: ValueNode) => {
        if (ast.kind !== Kind.INT) throw new TypeError('Invalid literal');
        return Number(ast.value);
      },
      jsonSchema: { type: 'integer' },
    }),
  Float_unsecure: (): FieldType<number> =>
    new FieldType<number>({
      name: 'Float_unsecure',
      description: 'Unvalidated float scalar',
      zod: z.number(),
      parseValue: (v) => {
        const num = typeof v === 'number' ? v : Number(v as unknown);
        return z.number().parse(num);
      },
      serialize: (v) => Number(v),
      parseLiteral: (ast: ValueNode) => {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT)
          throw new TypeError('Invalid literal');
        return Number(ast.value);
      },
      jsonSchema: { type: 'number' },
    }),
  Boolean: (): FieldType<boolean> =>
    new FieldType<boolean>({
      name: 'Boolean',
      description: 'Unvalidated boolean scalar',
      zod: z.boolean(),
      parseValue: (v) => z.coerce.boolean().parse(v),
      serialize: (v) => Boolean(v),
      parseLiteral: (ast: ValueNode) => {
        if (ast.kind !== Kind.BOOLEAN) throw new TypeError('Invalid literal');
        return ast.value;
      },
      jsonSchema: { type: 'boolean' },
    }),
  ID: (): FieldType<string> =>
    new FieldType<string>({
      name: 'ID',
      description: 'Unvalidated id scalar',
      zod: z.string(),
      parseValue: (v) => z.string().parse(v),
      serialize: (v) => String(v),
      parseLiteral: (ast: ValueNode) => {
        if (ast.kind !== Kind.STRING) throw new TypeError('Invalid literal');
        return ast.value;
      },
      jsonSchema: { type: 'string' },
    }),

  // Validated custom scalars
  JSON: (): FieldType<unknown> =>
    new FieldType<unknown>({
      name: 'JSON',
      zod: z.any(),
      parseValue: (v) => v,
      serialize: (v) => v,
      jsonSchema: {},
    }),
  JSONObject: (): FieldType<Record<string, unknown>> =>
    new FieldType<Record<string, unknown>>({
      name: 'JSONObject',
      zod: z.record(z.string(), z.any()),
      parseValue: (v) => z.record(z.string(), z.any()).parse(v),
      serialize: (v) => (v ?? {}) as Record<string, unknown>,
      jsonSchema: { type: 'object' },
    }),
  Date: (): FieldType<Date, string> =>
    new FieldType<Date, string>({
      name: 'Date',
      zod: z.date(),
      parseValue: (v) => (v instanceof Date ? v : new Date(String(v))),
      serialize: (v) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        v instanceof Date ? v.toISOString().split('T')[0]! : String(v),
      jsonSchema: { type: 'string', format: 'date' },
    }),
  DateTime: (): FieldType<Date, string> =>
    new FieldType<Date, string>({
      name: 'DateTime',
      zod: z.date(),
      parseValue: (v) => (v instanceof Date ? v : new Date(String(v))),
      serialize: (v) => {
        return v instanceof Date ? v.toISOString() : String(v);
      },
      jsonSchema: { type: 'string', format: 'date-time' },
    }),
  Time: (): FieldType<string> =>
    new FieldType<string>({
      name: 'Time',
      zod: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      parseValue: (v) =>
        z
          .string()
          .regex(/^\d{2}:\d{2}(:\d{2})?$/)
          .parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: '^\\d{2}:\\d{2}(:\\d{2})?$' },
    }),
  EmailAddress: (): FieldType<string> =>
    new FieldType<string>({
      name: 'EmailAddress',
      zod: z.string().email(),
      parseValue: (v) => z.string().email().parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', format: 'email' },
    }),
  URL: (): FieldType<string> =>
    new FieldType<string>({
      name: 'URL',
      zod: z.string().url(),
      parseValue: (v) => z.string().url().parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', format: 'uri' },
    }),
  PhoneNumber: (): FieldType<string> =>
    new FieldType<string>({
      name: 'PhoneNumber',
      zod: z.string().regex(phoneRegex),
      parseValue: (v) => z.string().regex(phoneRegex).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: phoneRegex.source },
    }),
  NonEmptyString: (): FieldType<string> =>
    new FieldType<string>({
      name: 'NonEmptyString',
      zod: z.string().min(1),
      parseValue: (v) => z.string().min(1).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', minLength: 1 },
    }),
  Locale: (): FieldType<string> =>
    new FieldType<string>({
      name: 'Locale',
      zod: z.string().regex(localeRegex),
      parseValue: (v) => z.string().regex(localeRegex).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: localeRegex.source },
    }),
  TimeZone: (): FieldType<string> =>
    new FieldType<string>({
      name: 'TimeZone',
      zod: z.string().regex(timezoneRegex),
      parseValue: (v) => z.string().regex(timezoneRegex).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: timezoneRegex.source },
    }),
  Latitude: (): FieldType<number> =>
    new FieldType<number>({
      name: 'Latitude',
      zod: z.number().min(latMin).max(latMax),
      parseValue: (v) => z.coerce.number().min(latMin).max(latMax).parse(v),
      serialize: (v) => Number(v),
      jsonSchema: { type: 'number', minimum: latMin, maximum: latMax },
    }),
  Longitude: (): FieldType<number> =>
    new FieldType<number>({
      name: 'Longitude',
      zod: z.number().min(lonMin).max(lonMax),
      parseValue: (v) => z.coerce.number().min(lonMin).max(lonMax).parse(v),
      serialize: (v) => Number(v),
      jsonSchema: { type: 'number', minimum: lonMin, maximum: lonMax },
    }),
  Currency: (): FieldType<string> =>
    new FieldType<string>({
      name: 'Currency',
      zod: z.string().regex(currencyRegex),
      parseValue: (v) => z.string().regex(currencyRegex).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: currencyRegex.source },
    }),
  CountryCode: (): FieldType<string> =>
    new FieldType<string>({
      name: 'CountryCode',
      zod: z.string().regex(countryRegex),
      parseValue: (v) => z.string().regex(countryRegex).parse(v),
      serialize: (v) => String(v),
      jsonSchema: { type: 'string', pattern: countryRegex.source },
    }),
  //   GeoJSON: (): FieldType<Record<string, unknown>, Record<string, unknown>> =>
  //     new FieldType<Record<string, unknown>, Record<string, unknown>>({
  //       name: 'GeoJSON',
  //       zod: z.object({ type: z.string(), coordinates: z.any() }).passthrough(),
  //       parseValue: (v) =>
  //         z
  //           .object({ type: z.string(), coordinates: z.any() })
  //           .passthrough()
  //           .parse(v),
  //       serialize: (v) => v,
  //       jsonSchema: { type: 'object' },
  //     }),
} as const;
export type ScalarTypeEnum = [keyof typeof ScalarTypeEnum];
