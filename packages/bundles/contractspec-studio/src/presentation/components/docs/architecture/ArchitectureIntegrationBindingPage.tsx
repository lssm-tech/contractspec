import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Integration Binding: ContractSpec Docs',
//   description:
//     'Learn how apps bind to integrations through AppIntegrationBinding in ContractSpec.',
// };

export function ArchitectureIntegrationBindingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Integration Binding</h1>
        <p className="text-muted-foreground">
          Integration binding connects your app's capabilities to external
          service providers. Each tenant can configure their own integration
          connections while sharing the same app blueprint.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <p className="text-muted-foreground">
          Integration binding follows a three-layer model:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            <strong>IntegrationSpec</strong> (global) - Defines what an
            integration provides
          </li>
          <li>
            <strong>IntegrationConnection</strong> (per-tenant) - A tenant's
            configured connection
          </li>
          <li>
            <strong>AppIntegrationBinding</strong> (per-app) - Maps named slots
            to concrete tenant connections
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Payment processing</h2>
        <p className="text-muted-foreground">
          Let's walk through a complete example of binding Stripe for payments.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 1: Blueprint declares requirement
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// AppBlueprintSpec
{
  meta: { name: "invoice-app", version: 1, appId: "invoice" },
  integrationSlots: [
    {
      slotId: "payments.primary",
      requiredCategory: "payments",
      allowedModes: ["managed", "byok"],
      requiredCapabilities: [
        { key: "payments.createPaymentIntent", version: 1 },
        { key: "payments.createRefund", version: 1 }
      ],
      required: true,
      description: "Primary PSP used for Checkout and Subscription flows"
    }
  ],
  workflows: {
    checkout: { name: "invoice.checkout", version: 1 }
  },
  branding: {
    appNameKey: "invoice.appName",
    assets: [{ type: "logo", url: "https://cdn.acme.dev/logo.png" }],
    colorTokens: { primary: "colors.brand.primary" }
  }
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 2: Tenant creates connection
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// IntegrationConnection
{
  meta: {
    id: "conn_stripe_acme_prod",
    tenantId: "acme-corp",
    integrationKey: "payments.stripe",
    integrationVersion: 1,
    label: "Stripe Production",
    environment: "production",
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-15T10:30:00Z"
  },
  ownershipMode: "byok",
  externalAccountId: "acct_123",
  config: {
    accountId: "acct_123",
    webhookUrl: "https://acme.app/webhooks/stripe"
  },
  secretRef: "vault://integrations/acme/conn_stripe_acme_prod",
  status: "active"
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 3: TenantAppConfig binds connection
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// TenantAppConfig
{
  meta: {
    tenantId: "acme-corp",
    blueprintName: "invoice-app",
    blueprintVersion: 1,
    environment: "production",
    version: 4,
    status: "published"
  },
  integrations: [
    {
      slotId: "payments.primary",
      connectionId: "conn_stripe_acme_prod",
      scope: {
        workflows: ["checkout", "subscription-renewal", "refund-process"],
        operations: ["payments.stripe.*"]
      },
      priority: 1
    }
  ],
  branding: {
    appName: { en: "Acme Billing Portal" },
    customDomain: "billing.acme.com",
    assets: [{ type: "logo", url: "https://assets.acme.com/logo.svg" }]
  }
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Step 4: Runtime resolves and executes
          </h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// ResolvedAppConfig (runtime)
{
  integrations: {
    "payments.createPaymentIntent": {
      provider: { /* IntegrationSpec for Stripe */ },
      connection: { /* IntegrationConnection */ },
      config: { /* Merged configuration */ }
    }
  }
}

// When workflow executes:
const result = await executeCapability(
  "payments.createPaymentIntent",
  { amount: 5000, currency: "usd" },
  resolvedConfig
);
// → Uses Stripe connection automatically`}</pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Multi-integration scenarios</h2>
        <p className="text-muted-foreground">
          A single app can use multiple integrations across different
          categories:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`integrations: [
  {
    slotId: "payments.primary",
    connectionId: "conn_stripe_prod",
    scope: {
      workflows: ["checkout", "subscription-*"]
    }
  },
  {
    slotId: "email.outbound",
    connectionId: "conn_postmark_prod"
  },
  {
    slotId: "email.inbound",
    connectionId: "conn_gmail_support",
    scope: {
      workflows: ["support-ticket-creation"]
    }
  },
  {
    slotId: "knowledge.vector-store",
    connectionId: "conn_qdrant_prod",
    scope: {
      workflows: ["semantic-search", "rag-query"]
    }
  }
]`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sandbox vs Production</h2>
        <p className="text-muted-foreground">
          Tenants typically maintain separate connections for sandbox and
          production environments:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`// Sandbox environment
{
  meta: { environment: "sandbox", status: "preview" },
  integrations: [
    {
      slotId: "payments.primary",
      connectionId: "conn_stripe_acme_test"
    }
  ]
}

// Production environment
{
  meta: { environment: "production", status: "published" },
  integrations: [
    {
      slotId: "payments.primary",
      connectionId: "conn_stripe_acme_prod"
    }
  ]
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Security & validation</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Integration connections are validated before binding - health checks
            ensure connectivity
          </li>
          <li>
            Secrets are never stored in TenantAppConfig - only references to
            encrypted secrets
          </li>
          <li>
            Policy Decision Point (PDP) enforces which workflows can use which
            integrations
          </li>
          <li>
            All integration calls are audited with full request/response logging
          </li>
          <li>Rate limiting and quotas are enforced per connection</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use wildcard patterns sparingly in <code>allowedWorkflows</code> -
            be explicit about access
          </li>
          <li>Always maintain separate sandbox and production connections</li>
          <li>
            Monitor integration health checks and set up alerts for failures
          </li>
          <li>
            Document the purpose of each integration binding for your team
          </li>
          <li>
            Test integration changes in sandbox before promoting to production
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/architecture/app-config" className="btn-ghost">
          Previous: App Configuration
        </Link>
        <Link
          href="/docs/architecture/knowledge-binding"
          className="btn-primary"
        >
          Knowledge Binding <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
