import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'App Configuration: ContractSpec Docs',
//   description:
//     'Learn about AppBlueprintSpec, TenantAppConfig, and ResolvedAppConfig in ContractSpec.',
// };

export function ArchitectureAppConfigPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">App Configuration</h1>
        <p className="text-muted-foreground">
          ContractSpec uses a three-tier configuration model that separates
          global app definitions from tenant-specific settings and runtime
          resolution.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AppBlueprintSpec</h2>
        <p className="text-muted-foreground">
          The <strong>AppBlueprintSpec</strong> is the global, versioned
          definition of your application. It contains no tenant-specific
          information and is stored in version control.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type AppBlueprintSpec = {
  id: string;
  version: string;
  name: string;
  description: string;
  
  // Core specs
  capabilities: CapabilitySpec[];
  dataViews: DataViewSpec[];
  workflows: WorkflowSpec[];
  policies: PolicySpec[];
  
  // Required integrations
  requiredIntegrations: {
    integrationId: string;
    category: IntegrationCategory;
    purpose: string;
    optional?: boolean;
  }[];
  
  // Expected knowledge spaces
  knowledgeSpaces: {
    spaceId: string;
    category: KnowledgeCategory;
    required: boolean;
    purpose: string;
  }[];
  
  // UI/UX
  theme: ThemeSpec;
  overlays: OverlaySpec[];
  
  // Observability
  telemetry: TelemetrySpec;
  
  // Schema evolution
  migrations: MigrationSpec[];
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">TenantAppConfig</h2>
        <p className="text-muted-foreground">
          The <strong>TenantAppConfig</strong> is the per-tenant,
          per-environment configuration that customizes how a specific tenant
          uses the app.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type TenantAppConfig = {
  tenantId: string;
  blueprintId: string;
  blueprintVersion: string;
  environment: "sandbox" | "staging" | "production";
  status: "draft" | "preview" | "published" | "archived" | "superseded";
  
  // Integration bindings
  integrationBindings: AppIntegrationBinding[];
  
  // Knowledge bindings
  knowledgeBindings: AppKnowledgeBinding[];
  
  // Tenant-specific overrides
  featureFlags: Record<string, boolean>;
  limits: {
    maxUsers?: number;
    maxStorage?: number;
    rateLimit?: number;
  };
  
  // Tenant customization
  branding: {
    logo?: string;
    colors?: Record<string, string>;
    domain?: string;
  };
  
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AppIntegrationBinding</h2>
        <p className="text-muted-foreground">
          Defines how a tenant connects specific integration instances to
          satisfy capabilities and workflows.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type AppIntegrationBinding = {
  slotId: string;          // References AppIntegrationSlot.slotId
  connectionId: string;    // References IntegrationConnection.meta.id
  scope?: {
    workflows?: string[];
    operations?: string[];
    features?: string[];
  };
  priority?: number;       // Lower number = higher priority
};

// Example:
{
  slotId: "payments.primary",
  connectionId: "conn_stripe_acme_prod",
  scope: {
    workflows: ["checkout", "subscription-renewal"],
    operations: ["payments.stripe.*"]
  },
  priority: 1
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AppKnowledgeBinding</h2>
        <p className="text-muted-foreground">
          Defines which knowledge spaces a tenant's app can access and how.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type AppKnowledgeBinding = {
  spaceId: string;
  enabled: boolean;
  
  // Which workflows/agents can read this space
  allowedConsumers: {
    workflowIds?: string[];
    agentIds?: string[];
    roles?: string[];
  };
  
  // Category-based access control
  allowedCategories: KnowledgeCategory[];
  
  // Sources feeding this space for this tenant
  sources: string[];  // References KnowledgeSourceConfig IDs
  
  metadata?: Record<string, unknown>;
};

// Example:
{
  spaceId: "product-canon",
  enabled: true,
  allowedConsumers: {
    workflowIds: ["invoice-generation", "quote-creation"],
    agentIds: ["support-agent"]
  },
  allowedCategories: ["canonical", "operational"],
  sources: ["src_notion_product_docs", "src_database_schema"]
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">ResolvedAppConfig</h2>
        <p className="text-muted-foreground">
          The <strong>ResolvedAppConfig</strong> is the runtime result of
          merging AppBlueprintSpec with TenantAppConfig. It's computed on-demand
          and never persisted.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type ResolvedAppConfig = {
  appId: string;
  tenantId: string;
  blueprintName: string;
  blueprintVersion: number;
  environment?: string;
  configVersion: number;

  capabilities: { enabled: CapabilityRef[]; disabled: CapabilityRef[] };
  features: { include: FeatureRef[]; exclude: FeatureRef[] };
  dataViews: Record<string, SpecPointer>;
  workflows: Record<string, SpecPointer>;
  policies: PolicyRef[];
  theme?: AppThemeBinding;
  telemetry?: TelemetryBinding;
  experiments: {
    catalog: ExperimentRef[];
    active: ExperimentRef[];
    paused: ExperimentRef[];
  };
  featureFlags: FeatureFlagState[];
  routes: AppRouteConfig[];

  integrations: ResolvedIntegration[]; // [{ slot, binding, connection, spec }]
  knowledge: ResolvedKnowledge[];       // [{ binding, space, sources }]
  branding: ResolvedBranding;           // { appName, assets, colors, domain }
  notes?: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuration flow</h2>
        <p className="text-muted-foreground">
          Here's how configuration flows from definition to runtime:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            <strong>Development</strong> - Define AppBlueprintSpec with required
            integrations and knowledge spaces
          </li>
          <li>
            <strong>Deployment</strong> - Deploy blueprint to environment
            (sandbox, staging, production)
          </li>
          <li>
            <strong>Tenant Setup</strong> - Create TenantAppConfig with specific
            integration connections and knowledge sources
          </li>
          <li>
            <strong>Runtime</strong> - Resolve configuration on-demand when
            tenant accesses the app
          </li>
          <li>
            <strong>Execution</strong> - Use ResolvedAppConfig to execute
            capabilities, workflows, and enforce policies
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Keep AppBlueprintSpec environment-agnostic - no secrets or
            tenant-specific data
          </li>
          <li>
            Use TenantAppConfig for all tenant-specific settings and connections
          </li>
          <li>
            Cache ResolvedAppConfig per request to avoid repeated resolution
          </li>
          <li>Version blueprints carefully - migrations affect all tenants</li>
          <li>
            Test blueprint changes in sandbox before promoting to production
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/architecture" className="btn-ghost">
          Back to Architecture
        </Link>
        <Link
          href="/docs/architecture/integration-binding"
          className="btn-primary"
        >
          Integration Binding <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
