import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';

export function LibrariesSchemaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.schema</h1>
        <p className="text-muted-foreground">
          A small schema dictionary to describe operation I/O once and export to
          Zod (runtime validation), Pothos (GraphQL type refs), and JSON Schema.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.schema" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Exports</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              SchemaModel
            </code>
            : Compose fields into typed object models
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              ScalarTypeEnum
            </code>
            : Common scalar types (NonEmptyString, Email, DateTime, etc.)
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              defineEnum
            </code>
            : Create type-safe enums
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              FieldType
            </code>
            : Wrap scalars with Zod/GraphQL/JSON Schema
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Basic Schema</h2>
        <CodeBlock
          language="typescript"
          code={`import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const CreateSpotInput = new SchemaModel({
  name: 'CreateSpotInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    latitude: { type: ScalarTypeEnum.Latitude(), isOptional: false },
    longitude: { type: ScalarTypeEnum.Longitude(), isOptional: false },
  },
});

// Get Zod schema for validation
const zodSchema = CreateSpotInput.getZod();

// Get Pothos input name for GraphQL
const pothosName = CreateSpotInput.getPothosInput();

// Get JSON Schema
const jsonSchema = CreateSpotInput.getJsonSchema();`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Enums</h2>
        <CodeBlock
          language="typescript"
          code={`import { defineEnum, SchemaModel } from '@contractspec/lib.schema';

const Weekday = defineEnum('Weekday', [
  'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU',
] as const);

const RecurrenceRule = new SchemaModel({
  name: 'RecurrenceRule',
  fields: {
    frequency: {
      type: defineEnum('Frequency', ['DAILY', 'WEEKLY', 'MONTHLY'] as const),
      isOptional: false
    },
    byWeekday: { type: Weekday, isOptional: true, isArray: true },
  },
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Scalars</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Strings</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code>NonEmptyString()</code>
              </li>
              <li>
                <code>Email()</code>
              </li>
              <li>
                <code>PhoneNumber()</code>
              </li>
              <li>
                <code>CountryCode()</code>
              </li>
              <li>
                <code>Locale()</code>
              </li>
              <li>
                <code>TimeZone()</code>
              </li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Numbers</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code>PositiveNumber()</code>
              </li>
              <li>
                <code>Latitude()</code>
              </li>
              <li>
                <code>Longitude()</code>
              </li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Dates & Times</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code>Date()</code>
              </li>
              <li>
                <code>DateTime()</code>
              </li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Generic</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code>String()</code>
              </li>
              <li>
                <code>JSON()</code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/contracts" className="btn-ghost">
          Previous: Contracts
        </Link>
        <Link href="/docs/libraries/ui-kit" className="btn-primary">
          Next: UI Kit <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
