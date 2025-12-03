import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Specifications Overview: ContractSpec Docs',
//   description:
//     'Learn about all specification types in ContractSpec and why spec-first development matters.',
// };

export default function SpecsOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Specifications Overview</h1>
        <p className="text-muted-foreground">
          ContractSpec is built on a <strong>spec-first</strong> philosophy. You
          define declarative TypeScript specifications that describe what your
          application can do. Runtime adapters automatically serve these specs
          as type-safe API endpoints (REST, GraphQL, MCP), enforce policies, and
          validate inputs/outputs—no code generation required.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why spec-first matters</h2>
        <p className="text-muted-foreground">
          Traditional development requires writing and maintaining separate code
          for APIs, databases, UI components, validation logic, and access
          control. This approach leads to:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Duplication across front-end and back-end</li>
          <li>Type mismatches and runtime errors</li>
          <li>Security vulnerabilities from inconsistent policy enforcement</li>
          <li>High maintenance burden when requirements change</li>
        </ul>
        <p className="text-muted-foreground">
          With ContractSpec, you define your application's operations
          (Commands/Queries), workflows, and policies in pure TypeScript.
          Runtime adapters ensure consistency, type safety, and policy
          enforcement across your entire stack—the spec <em>is</em> the
          implementation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Specification types</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Spec Type</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Generates</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <Link
                    href="/docs/specs/capabilities"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    <strong>CapabilitySpec</strong>
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  Defines what your application can do: operations
                  (Commands/Queries), their inputs, outputs, policies, and side
                  effects.
                </td>
                <td className="px-4 py-3 align-top">
                  Runtime-served REST/GraphQL/MCP endpoints, Zod validation,
                  policy enforcement
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>DataViewSpec</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Describes how data should be queried, filtered, sorted, and
                  presented to users.
                </td>
                <td className="px-4 py-3 align-top">
                  Database queries, list/detail views, search interfaces
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <Link
                    href="/docs/specs/workflows"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    <strong>WorkflowSpec</strong>
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  Orchestrates multi-step processes with retries, compensation,
                  and monitoring.
                </td>
                <td className="px-4 py-3 align-top">
                  Workflow engine, state machines, retry logic, observability
                  hooks
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>PolicySpec</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Defines who can do what, when, and under what conditions.
                  Supports ABAC and PII rules.
                </td>
                <td className="px-4 py-3 align-top">
                  Policy decision points, access control middleware, audit logs
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>OverlaySpec</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Allows safe, signed customization of UI layouts and field
                  visibility by tenants or users.
                </td>
                <td className="px-4 py-3 align-top">
                  Personalized UI components, layout variations, conditional
                  rendering
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>TelemetrySpec</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Specifies what metrics, logs, and traces to collect for
                  observability.
                </td>
                <td className="px-4 py-3 align-top">
                  Instrumentation code, dashboards, alerting rules
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <Link
                    href="/docs/safety/migrations"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    <strong>MigrationSpec</strong>
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  Manages incremental, reversible schema and data migrations.
                </td>
                <td className="px-4 py-3 align-top">
                  Migration scripts, rollback procedures, version tracking
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How specs work together</h2>
        <p className="text-muted-foreground">
          Specs compose naturally. A <strong>WorkflowSpec</strong> can invoke
          multiple <strong>CapabilitySpecs</strong>. A{' '}
          <strong>DataViewSpec</strong> respects <strong>PolicySpecs</strong> to
          filter sensitive fields. An <strong>OverlaySpec</strong> can hide or
          rearrange UI elements generated from a <strong>CapabilitySpec</strong>
          , but only within the bounds allowed by the underlying policy.
        </p>
        <p className="text-muted-foreground">
          This composability means you can build complex applications from
          simple, reusable building blocks—all while maintaining type safety and
          policy enforcement.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Next steps</h2>
        <p className="text-muted-foreground">
          Explore each specification type in detail using the links in the table
          above, or continue with the core concepts:
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/docs/specs/capabilities" className="btn-primary">
            Capabilities <ChevronRight size={16} className="inline" />
          </Link>
          <Link href="/docs/specs/workflows" className="btn-ghost">
            Workflows <ChevronRight size={16} className="inline" />
          </Link>
          <Link href="/docs/safety" className="btn-ghost">
            Safety Features <ChevronRight size={16} className="inline" />
          </Link>
        </div>
      </div>
    </div>
  );
}
