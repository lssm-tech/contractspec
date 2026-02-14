import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight, Layers, Zap, Shield, Globe } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

const contractTypes = [
  {
    name: 'Operations',
    factory: 'defineCommand / defineQuery',
    description:
      'API endpoints with input/output schemas, validation, and policy.',
    icon: Zap,
    color: 'text-blue-400',
  },
  {
    name: 'Events',
    factory: 'defineEvent',
    description: 'Domain events with typed payloads and PII handling.',
    icon: Layers,
    color: 'text-green-400',
  },
  {
    name: 'Capabilities',
    factory: 'defineCapability',
    description: 'Feature groupings that link operations, events, and UIs.',
    icon: Shield,
    color: 'text-purple-400',
  },
  {
    name: 'Presentations',
    factory: 'definePresentation',
    description:
      'UI specifications for rendering data and handling interactions.',
    icon: Globe,
    color: 'text-orange-400',
  },
];

export function GuideContractTypesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Contract Types Overview</h1>
        <p className="text-muted-foreground text-lg">
          Learn about the different contract types in ContractSpec and when to
          use each one for spec-first development.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Core Contract Types</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {contractTypes.map((type) => (
            <div
              key={type.name}
              className="flex items-start gap-3 rounded-lg border border-white/10 p-4"
            >
              <type.icon className={type.color} size={20} />
              <div className="space-y-1">
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {type.description}
                </p>
                <code className="text-xs text-violet-400">{type.factory}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operations Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">
            1) Operations (Commands & Queries)
          </h2>
          <p className="text-muted-foreground text-sm">
            Operations are the backbone of your API. Commands mutate state,
            queries read state. Both have typed input/output schemas.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user.operation.ts"
            code={`import { defineCommand, defineQuery } from "@contractspec/lib.contracts-spec";
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

// Command: Mutates state (creates a user)
export const CreateUserCommand = defineCommand({
  meta: {
    key: "user.create",
    version: "1.0.0",
    description: "Create a new user account",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users", "auth"],
  },
  io: {
    input: new SchemaModel({
      name: "CreateUserInput",
      fields: {
        email: { type: ScalarTypeEnum.Email(), isOptional: false },
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
      },
    }),
    output: new SchemaModel({
      name: "CreateUserOutput",
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
        email: { type: ScalarTypeEnum.Email(), isOptional: false },
      },
    }),
    errors: {
      EMAIL_EXISTS: {
        description: "Email already registered",
        http: 409,
        when: "User with this email already exists",
      },
    },
  },
  policy: { auth: "admin" },
});

// Query: Reads state (gets user by ID)
export const GetUserQuery = defineQuery({
  meta: {
    key: "user.get",
    version: "1.0.0",
    description: "Get user by ID",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users"],
  },
  io: {
    input: new SchemaModel({
      name: "GetUserInput",
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
      },
    }),
    output: new SchemaModel({
      name: "GetUserOutput",
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
        email: { type: ScalarTypeEnum.Email(), isOptional: false },
        name: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
  },
  policy: { auth: "user" },
});`}
          />
        </div>

        {/* Events Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Events</h2>
          <p className="text-muted-foreground text-sm">
            Events represent domain occurrences. They have typed payloads with
            PII field marking for compliance.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user.event.ts"
            code={`import { defineEvent } from "@contractspec/lib.contracts-spec";
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

export const UserCreatedEvent = defineEvent({
  meta: {
    key: "user.created",
    version: "1.0.0",
    description: "Emitted when a new user is created",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users", "auth"],
  },
  // Mark PII fields for redaction in logs/exports
  pii: ["email"],
  payload: new SchemaModel({
    name: "UserCreatedPayload",
    fields: {
      userId: { type: ScalarTypeEnum.UUID(), isOptional: false },
      email: { type: ScalarTypeEnum.Email(), isOptional: false },
      createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    },
  }),
});

export const UserDeletedEvent = defineEvent({
  meta: {
    key: "user.deleted",
    version: "1.0.0",
    description: "Emitted when a user is deleted",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users"],
  },
  payload: new SchemaModel({
    name: "UserDeletedPayload",
    fields: {
      userId: { type: ScalarTypeEnum.UUID(), isOptional: false },
      deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
      reason: { type: ScalarTypeEnum.String(), isOptional: true },
    },
  }),
});`}
          />
        </div>

        {/* Capabilities Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Capabilities</h2>
          <p className="text-muted-foreground text-sm">
            Capabilities group related operations, events, and presentations.
            They define feature boundaries and dependencies.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user-management.capability.ts"
            code={`import { defineCapability } from "@contractspec/lib.contracts-spec";

export const UserManagementCapability = defineCapability({
  meta: {
    key: "user.management",
    version: "1.0.0",
    description: "User account management features",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users", "core"],
    kind: "api",
  },
  // Operations/events this capability provides
  provides: [
    { surface: "operation", key: "user.create", version: "1.0.0" },
    { surface: "operation", key: "user.get", version: "1.0.0" },
    { surface: "operation", key: "user.delete", version: "1.0.0" },
    { surface: "event", key: "user.created", version: "1.0.0" },
    { surface: "event", key: "user.deleted", version: "1.0.0" },
  ],
  // Dependencies on other capabilities
  requires: [
    { key: "auth.core", reason: "Needs authentication for user operations" },
  ],
});

// Capabilities can extend other capabilities
export const AdminUserCapability = defineCapability({
  meta: {
    key: "user.admin",
    version: "1.0.0",
    description: "Admin-only user management features",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users", "admin"],
    kind: "api",
  },
  // Inherit from base capability
  extends: { key: "user.management", version: "1.0.0" },
  provides: [
    { surface: "operation", key: "user.ban", version: "1.0.0" },
    { surface: "operation", key: "user.impersonate", version: "1.0.0" },
  ],
});`}
          />
        </div>

        {/* Presentations Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">4) Presentations</h2>
          <p className="text-muted-foreground text-sm">
            Presentations define UI specifications. They link to capabilities
            and specify how data should be displayed.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user-list.presentation.ts"
            code={`import { definePresentation } from "@contractspec/lib.contracts-spec";

export const UserListPresentation = definePresentation({
  meta: {
    key: "users.list",
    version: "1.0.0",
    description: "Display a list of users with search and pagination",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["users", "ui"],
  },
  // Link to capability that provides data
  capability: { key: "user.management", version: "1.0.0" },
  // UI specifications
  config: {
    title: "Users",
    layout: "table",
    columns: ["name", "email", "createdAt", "status"],
    actions: ["view", "edit", "delete"],
    pagination: { defaultPageSize: 25 },
    search: { fields: ["name", "email"] },
  },
});`}
          />
        </div>

        {/* Additional Types Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">5) Additional Contract Types</h2>
          <p className="text-muted-foreground text-sm">
            ContractSpec provides specialized contracts for different concerns:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Policy</h3>
              <code className="text-xs text-violet-400">definePolicy</code>
              <p className="text-muted-foreground text-xs">
                RBAC/ABAC rules, rate limits, and access control.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Workflow</h3>
              <code className="text-xs text-violet-400">defineWorkflow</code>
              <p className="text-muted-foreground text-xs">
                Multi-step processes with states, transitions, and SLAs.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Translation</h3>
              <code className="text-xs text-violet-400">defineTranslation</code>
              <p className="text-muted-foreground text-xs">
                i18n messages with ICU format and locale fallbacks.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Integration</h3>
              <code className="text-xs text-violet-400">defineIntegration</code>
              <p className="text-muted-foreground text-xs">
                External service connections and API adapters.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Form</h3>
              <code className="text-xs text-violet-400">defineFormSpec</code>
              <p className="text-muted-foreground text-xs">
                Form definitions with fields, validation, and layouts.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Data View</h3>
              <code className="text-xs text-violet-400">defineDataView</code>
              <p className="text-muted-foreground text-xs">
                Read-only data projections and aggregations.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Feature</h3>
              <code className="text-xs text-violet-400">defineFeature</code>
              <p className="text-muted-foreground text-xs">
                Feature flags and progressive rollout configurations.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Test</h3>
              <code className="text-xs text-violet-400">defineTestSpec</code>
              <p className="text-muted-foreground text-xs">
                Contract-driven test scenarios and fixtures.
              </p>
            </div>
          </div>
        </div>

        {/* Registry Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">6) Registering Contracts</h2>
          <p className="text-muted-foreground text-sm">
            Each contract type has a registry for lookup and validation.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/registry.ts"
            code={`import {
  OperationSpecRegistry,
  installOp,
} from "@contractspec/lib.contracts-spec/operations";
import { EventRegistry } from "@contractspec/lib.contracts-spec";
import { CapabilityRegistry } from "@contractspec/lib.contracts-spec/capabilities";

// Import your contracts
import { CreateUserCommand, GetUserQuery } from "./user.operation";
import { UserCreatedEvent } from "./user.event";
import { UserManagementCapability } from "./user-management.capability";

// Create registries
export const operationRegistry = new OperationSpecRegistry();
export const eventRegistry = new EventRegistry();
export const capabilityRegistry = new CapabilityRegistry();

// Register operations with handlers
installOp(operationRegistry, CreateUserCommand, async (input) => {
  // Your implementation here
  return { id: "uuid", email: input.email };
});

installOp(operationRegistry, GetUserQuery, async (input) => {
  // Your implementation here
  return { id: input.id, email: "user@example.com", name: "User" };
});

// Register events and capabilities
eventRegistry.register(UserCreatedEvent);
capabilityRegistry.register(UserManagementCapability);`}
          />
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">
            Contract Type Decision Guide
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 text-left">When you need...</th>
                <th className="py-2 text-left">Use this contract</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5">
                <td className="py-2">An API endpoint that changes data</td>
                <td className="py-2">
                  <code>defineCommand</code>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">An API endpoint that reads data</td>
                <td className="py-2">
                  <code>defineQuery</code>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">
                  Async notification of something that happened
                </td>
                <td className="py-2">
                  <code>defineEvent</code>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Group related specs under a feature</td>
                <td className="py-2">
                  <code>defineCapability</code>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Define UI rendering specifications</td>
                <td className="py-2">
                  <code>definePresentation</code>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Access control and rate limiting</td>
                <td className="py-2">
                  <code>definePolicy</code>
                </td>
              </tr>
              <tr>
                <td className="py-2">Multi-step business processes</td>
                <td className="py-2">
                  <code>defineWorkflow</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <StudioPrompt
          title="Want visual contract design?"
          body="Studio provides a visual editor for creating and managing contracts with team collaboration and version control."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/guides/nextjs-one-endpoint" className="btn-primary">
          Next: Add your first endpoint <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
