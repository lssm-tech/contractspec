import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Capabilities: ContractSpec Docs',
//   description: 'Learn how to define capabilities in ContractSpec.',
// };

export function SpecsCapabilitiesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Capabilities</h1>
        <p className="text-muted-foreground text-lg">
          Capabilities are the core building block of ContractSpec. They define
          what your app can do.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground">
            A ContractSpec (or Capability) is a typed, declarative description
            of an operation. It defines the operation's name, version, inputs,
            outputs, policies, and side effects. Runtime adapters automatically
            serve these as REST/GraphQL/MCP endpoints with full validation and
            policy enforcement.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Defining a Command (Write)</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`import { defineCommand } from '@contractspec/lib.contracts-spec';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const TransferFundsInput = new SchemaModel({
  name: 'TransferFundsInput',
  fields: {
    recipient: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    amount: { type: ScalarTypeEnum.PositiveNumber(), isOptional: false },
  },
});

const TransferFundsOutput = new SchemaModel({
  name: 'TransferFundsOutput',
  fields: {
    transactionId: { type: ScalarTypeEnum.String(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const TransferFunds = defineCommand({
  meta: {
    key: 'wallet.transferFunds',
    version: '1.0.0',
    description: 'Transfer funds to another user',
    goal: 'Enable peer-to-peer payments',
    context: 'Requires sufficient balance',
    owners: ['team-payments'],
    tags: ['payments'],
    stability: 'stable',
  },
  io: {
    input: TransferFundsInput,
    output: TransferFundsOutput,
  },
  policy: {
    auth: 'user',
    flags: ['payments_enabled'],
  },
});`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Schema Types</h2>
          <p className="text-muted-foreground">
            ContractSpec uses <code>@contractspec/lib.schema</code> for I/O
            definitions. This provides Zod validation, GraphQL types, and JSON
            Schema from a single source.
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              •{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                ScalarTypeEnum.NonEmptyString()
              </code>{' '}
              - Non-empty text
            </li>
            <li>
              •{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                ScalarTypeEnum.PositiveNumber()
              </code>{' '}
              - Positive numbers
            </li>
            <li>
              •{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                ScalarTypeEnum.DateTime()
              </code>{' '}
              - ISO 8601 timestamps
            </li>
            <li>
              •{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                ScalarTypeEnum.Email()
              </code>{' '}
              - Valid email addresses
            </li>
            <li>
              •{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                defineEnum(...)
              </code>{' '}
              - Type-safe enums
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link href="/docs/specs/dataviews" className="btn-primary">
            Next: DataViews <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
