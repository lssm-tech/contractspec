import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Architecture: ContractSpec Docs',
//   description:
//     "Understand ContractSpec's architecture: app configuration, integrations, knowledge, and runtime resolution.",
// };

export default function ArchitectureOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Architecture</h1>
        <p className="text-muted-foreground">
          ContractSpec's architecture is built on a foundation of typed
          specifications served by runtime adapters. This section covers the
          core architectural concepts: app configuration, integration binding,
          and knowledge management.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core layers</h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">1. Specification Layer</h3>
            <p className="text-muted-foreground">
              The foundation of ContractSpec. Typed specifications define what
              your application can do:
            </p>
            <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2">
              <li>
                <Link
                  href="/docs/specs/capabilities"
                  className="text-violet-400 hover:text-violet-300"
                >
                  CapabilitySpec
                </Link>{' '}
                - Operations and their inputs/outputs
              </li>
              <li>
                <Link
                  href="/docs/specs/dataviews"
                  className="text-violet-400 hover:text-violet-300"
                >
                  DataViewSpec
                </Link>{' '}
                - Data queries and presentation
              </li>
              <li>
                <Link
                  href="/docs/specs/workflows"
                  className="text-violet-400 hover:text-violet-300"
                >
                  WorkflowSpec
                </Link>{' '}
                - Multi-step processes
              </li>
              <li>
                <Link
                  href="/docs/specs/policy"
                  className="text-violet-400 hover:text-violet-300"
                >
                  PolicySpec
                </Link>{' '}
                - Access control and data protection
              </li>
              <li>
                <Link
                  href="/docs/integrations/spec-model"
                  className="text-violet-400 hover:text-violet-300"
                >
                  IntegrationSpec
                </Link>{' '}
                - External service providers
              </li>
              <li>
                <Link
                  href="/docs/knowledge/spaces"
                  className="text-violet-400 hover:text-violet-300"
                >
                  KnowledgeSpaceSpec
                </Link>{' '}
                - Knowledge and context management
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">2. Configuration Layer</h3>
            <p className="text-muted-foreground">
              How applications are configured and customized:
            </p>
            <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2">
              <li>
                <Link
                  href="/docs/architecture/app-config"
                  className="text-violet-400 hover:text-violet-300"
                >
                  AppBlueprintSpec
                </Link>{' '}
                - Global, versioned app definition
              </li>
              <li>
                <Link
                  href="/docs/architecture/app-config"
                  className="text-violet-400 hover:text-violet-300"
                >
                  TenantAppConfig
                </Link>{' '}
                - Per-tenant, per-environment configuration
              </li>
              <li>
                <Link
                  href="/docs/architecture/integration-binding"
                  className="text-violet-400 hover:text-violet-300"
                >
                  AppIntegrationBinding
                </Link>{' '}
                - How apps use integrations
              </li>
              <li>
                <Link
                  href="/docs/architecture/knowledge-binding"
                  className="text-violet-400 hover:text-violet-300"
                >
                  AppKnowledgeBinding
                </Link>{' '}
                - How apps access knowledge
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">3. Runtime Layer</h3>
            <p className="text-muted-foreground">
              How specifications are executed at runtime:
            </p>
            <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2">
              <li>
                <strong>ResolvedAppConfig</strong> - Merged blueprint + tenant
                config
              </li>
              <li>
                <strong>Policy Decision Point (PDP)</strong> - Enforces policies
                on every operation
              </li>
              <li>
                <strong>Presentation Runtime</strong> - React and React Native
                renderers
              </li>
              <li>
                <strong>Integration Connectors</strong> - Execute external API
                calls
              </li>
              <li>
                <strong>Knowledge Retrieval</strong> - Query vector databases
                and knowledge sources
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuration model</h2>
        <p className="text-muted-foreground">
          ContractSpec uses a three-tier configuration model:
        </p>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Layer</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Scope</th>
                <th className="px-4 py-3 font-semibold">Storage</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Blueprint</strong>
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs">
                  AppBlueprintSpec
                </td>
                <td className="px-4 py-3 align-top">
                  Global, versioned, no tenant info
                </td>
                <td className="px-4 py-3 align-top">
                  Version control, immutable
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Tenant Config</strong>
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs">
                  TenantAppConfig
                </td>
                <td className="px-4 py-3 align-top">
                  Per-tenant, per-environment
                </td>
                <td className="px-4 py-3 align-top">Database, mutable</td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Resolved Config</strong>
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs">
                  ResolvedAppConfig
                </td>
                <td className="px-4 py-3 align-top">Runtime, ephemeral</td>
                <td className="px-4 py-3 align-top">
                  In-memory, not persisted
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key architectural principles</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Spec-first</strong> - Everything is defined declaratively
            before code generation
          </li>
          <li>
            <strong>Type-safe</strong> - All specifications are strongly typed
            and validated at compile time
          </li>
          <li>
            <strong>Policy-enforced</strong> - Every operation passes through
            the PDP
          </li>
          <li>
            <strong>Multi-tenant by default</strong> - Tenant isolation is
            built-in, not bolted on
          </li>
          <li>
            <strong>Environment-aware</strong> - Separate configurations for
            sandbox, staging, production
          </li>
          <li>
            <strong>Auditable</strong> - All operations are logged for
            compliance and debugging
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/architecture/app-config" className="btn-primary">
          App Configuration <ChevronRight size={16} />
        </Link>
        <Link href="/docs/integrations" className="btn-ghost">
          Integrations
        </Link>
        <Link href="/docs/knowledge" className="btn-ghost">
          Knowledge & Context
        </Link>
      </div>
    </div>
  );
}
