import type { Metadata } from 'next';
import { specDrivenDevelopmentBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = new SeoOptimizer().optimize(
  specDrivenDevelopmentBrief
);

export function SpecDrivenDevelopmentPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          {specDrivenDevelopmentBrief.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {specDrivenDevelopmentBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Why Spec-driven?</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {specDrivenDevelopmentBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Benefits</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {specDrivenDevelopmentBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Feature Specification Example</h2>
          <p className="text-muted-foreground text-sm">
            Define a complete feature with operations, events, and data models.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user-management.feature.ts"
            code={`import { defineFeature } from '@contractspec/lib.contracts-spec/features';
import { defineOperation } from '@contractspec/lib.contracts-spec/operations';
import { defineEvent } from '@contractspec/lib.contracts-spec/events';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const UserManagementFeature = defineFeature({
  goal: 'Complete user management system with CRUD operations',
  context: 'Handles user lifecycle from creation to deletion with proper authorization',
  operations: {
    createUser: defineOperation({
      goal: 'Create a new user account',
      input: new SchemaModel({
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', required: true },
          name: { type: 'string', minLength: 1, required: true },
        },
      }),
      output: new SchemaModel({
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          email: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      }),
    }),
    updateUser: defineOperation({
      goal: 'Update existing user information',
      input: new SchemaModel({
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
        },
      }),
      output: new SchemaModel({
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          email: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      }),
    }),
  },
  events: {
    userCreated: defineEvent({
      goal: 'Emit when a new user is created',
      payload: new SchemaModel({
        type: 'object',
        properties: {
          userId: { type: 'string', required: true },
          email: { type: 'string', required: true },
        },
      }),
    }),
    userUpdated: defineEvent({
      goal: 'Emit when user information changes',
      payload: new SchemaModel({
        type: 'object',
        properties: {
          userId: { type: 'string', required: true },
          changes: { type: 'array', items: { type: 'string' }, required: true },
        },
      }),
    }),
  },
  metadata: {
    name: 'user-management',
    version: '1.0.0',
    description: 'Complete user management with operations and events',
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">
            Generate Type-safe Implementations
          </h2>
          <p className="text-muted-foreground text-sm">
            Generate validation, types, and API handlers from your feature.
          </p>
          <CodeBlock
            language="bash"
            filename="generate-from-feature"
            code={`contractspec generate \\
  --input ./src/contracts/user-management.feature.ts \\
  --output ./generated/user-management`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/spec-validation-and-typing"
          className="btn-primary"
        >
          Type Safety Guide <ChevronRight size={16} />
        </Link>
        <Link href="/docs/intent/deterministic-codegen" className="btn-ghost">
          Deterministic Codegen
        </Link>
      </div>
    </div>
  );
}
