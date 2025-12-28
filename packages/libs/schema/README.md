# @contractspec/lib.schema

[![npm version](https://img.shields.io/npm/v/@contractspec/lib.schema)](https://www.npmjs.com/package/@contractspec/lib.schema)
[![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.schema)](https://www.npmjs.com/package/@contractspec/lib.schema)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lssm-tech/contractspec)


Website: https://contractspec.io/


**Multi-surface consistency starts here** — Define schemas once, export to Zod, GraphQL, and JSON Schema.

A schema dictionary to describe operation I/O once and generate consistent types across all surfaces (API, database, UI). Part of ContractSpec's spec-first approach.

## Exports to:

- zod (runtime validation)
- Pothos (GraphQL type refs)
- JSON Schema (via `zod-to-json-schema` or custom `getJsonSchema()` on `FieldType`)

## Installation

```bash
npm install @contractspec/lib.schema
# or
bun add @contractspec/lib.schema
```

The package ships only pre-built `dist/` artifacts and type declarations. Import helpers directly, e.g.:

```ts
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
```

## Primitives

- `FieldType<T>` wraps a GraphQLScalarType and carries a zod schema, plus optional JSON Schema definition.
- `SchemaModel` composes fields into named object models with helpers:
  - `getZod()` → typed `z.ZodObject` preserving each field's schema and optionality
  - `getPothosInput()` → builder name for input object
  - `getPothosInput()` → builder name for input object
  - `getJsonSchema()` → resolved JSON Schema

### Multi-Format Wrappers

Use existing schema definitions from other libraries:
- `ZodSchemaType`: Wraps a raw Zod schema (`z.infer` becomes the TS type).
- `JsonSchemaType`: Wraps a JSON Schema object.
- `GraphQLSchemaType`: Wraps a GraphQL SDL string.

### Enums

- `EnumType<T>` represents string enums with a single source of truth:
  - `getZod()` → `z.enum([...])`
  - `getPothos()` → GraphQL `GraphQLEnumType`
  - `getJsonSchema()` → `{ type: 'string', enum: [...] }`
  - Create with `defineEnum('Name', ['A','B'] as const)`

Example

```ts
import { defineEnum, SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const Weekday = defineEnum('Weekday', [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
] as const);

const Rule = new SchemaModel({
  name: 'Rule',
  fields: {
    timezone: { type: ScalarTypeEnum.TimeZone(), isOptional: false },
    frequency: {
      type: defineEnum('RecurrenceFrequency', [
        'DAILY',
        'WEEKLY',
        'MONTHLY',
        'YEARLY',
      ] as const),
      isOptional: false,
    },
    byWeekday: { type: Weekday, isOptional: true, isArray: true },
  },
});
```

## Usage

Define fields with `FieldType` and group them into a `SchemaModel`. Adapters (REST/MCP/GraphQL) can consume these to generate appropriate I/O types while preserving a single source of truth.

## API Overview

- **FieldType<TInternal, TExternal = TInternal>**
  - `getZod()` → zod schema
  - `getPothos()` → GraphQL scalar type
  - `getJsonSchema()` → deeply-resolved JSON Schema
- **EnumType<T>**
  - Construct via `defineEnum('Name', ['A','B'] as const)`
  - `getZod()`, `getPothos()`, `getJsonSchema()`
- **SchemaModel<Fields>**
  - `getZod()` → typed `z.ZodObject`
  - `getPothosInput()` → input object name for GraphQL builders
  - Each field supports `{ isOptional: boolean, isArray?: true }`

## Patterns & Conventions

- Name models with PascalCase and suffix with `Input`/`Result` when ambiguous.
- Use `ScalarTypeEnum` for common scalars: `NonEmptyString`, `Date`, `DateTime`, `Locale`, `TimeZone`, `Latitude`, `Longitude`, `PhoneNumber`, etc.
- Prefer enums for constrained strings. Reuse enums across input/output models to ensure consistency.
- Top-level arrays: define a nested model and set `isArray: true` on the field that holds the list, or create a dedicated list model if needed by adapters.

## Example: Nested models + arrays

```ts
import { ScalarTypeEnum, SchemaModel, defineEnum } from '@contractspec/lib.schema';

const Weekday = defineEnum('Weekday', [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
] as const);

const Address = new SchemaModel({
  name: 'Address',
  fields: {
    city: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    country: { type: ScalarTypeEnum.CountryCode(), isOptional: false },
  },
});

export const CreateSpotInput = new SchemaModel({
  name: 'CreateSpotInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    latitude: { type: ScalarTypeEnum.Latitude(), isOptional: false },
    longitude: { type: ScalarTypeEnum.Longitude(), isOptional: false },
    availabilityWeekdays: { type: Weekday, isOptional: true, isArray: true },
    address: { type: Address, isOptional: true },
  },
});
```

## JSON Schema export

Prefer `getZod()` + `zod-to-json-schema` for consistency. For advanced cases, expose a custom `getJsonSchema()` from `FieldType` or a specialized wrapper.
