import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Integration Spec Model: ContractSpec Docs',
//   description:
//     'Learn about IntegrationSpec and IntegrationConnection in ContractSpec.',
// };

export default function IntegrationSpecModelPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Integration Spec Model</h1>
        <p className="text-muted-foreground">
          Integrations in ContractSpec are defined through typed specifications
          that declare capabilities, configuration requirements, and connection
          details. This page covers IntegrationSpec and IntegrationConnection.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">IntegrationSpec</h2>
        <p className="text-muted-foreground">
          The <strong>IntegrationSpec</strong> is a global definition of an
          integration provider. It declares what the integration provides and
          what it requires.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type IntegrationSpec = {
  id: string;
  label: string;
  description: string;
  category: IntegrationCategory;
  
  // Capabilities this integration provides
  providesCapabilities: {
    capabilityId: string;
    operation: string;
    description: string;
  }[];
  
  // Dependencies
  requirements: {
    capabilities?: string[];  // e.g., ["billing.core", "auth.session"]
    minVersion?: string;
  };
  
  // Configuration schema (non-secret)
  configSchema: {
    [key: string]: {
      type: string;
      description: string;
      required?: boolean;
      default?: unknown;
    };
  };
  
  // Secret schema (for keys, tokens)
  secretSchema: {
    [key: string]: {
      type: string;
      description: string;
      required: boolean;
    };
  };
  
  // Webhook support
  webhooks?: {
    supported: boolean;
    events: string[];
    signatureHeader?: string;
  };
  
  // Documentation
  docsUrl?: string;
  setupGuideUrl?: string;
  
  // Metadata
  version: string;
  createdAt: string;
  updatedAt: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Stripe IntegrationSpec</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`{
  id: "stripe",
  label: "Stripe",
  description: "Payment processing and subscription management",
  category: "payments",
  
  providesCapabilities: [
    {
      capabilityId: "payments.createPaymentIntent",
      operation: "createPaymentIntent",
      description: "Create a payment intent for checkout"
    },
    {
      capabilityId: "payments.createSubscription",
      operation: "createSubscription",
      description: "Create a recurring subscription"
    },
    {
      capabilityId: "payments.refund",
      operation: "refund",
      description: "Refund a payment"
    }
  ],
  
  requirements: {
    capabilities: ["billing.core"],
    minVersion: "1.0.0"
  },
  
  configSchema: {
    webhookUrl: {
      type: "string",
      description: "URL to receive Stripe webhooks",
      required: false
    }
  },
  
  secretSchema: {
    apiKey: {
      type: "string",
      description: "Stripe secret API key (sk_...)",
      required: true
    },
    webhookSecret: {
      type: "string",
      description: "Webhook signing secret (whsec_...)",
      required: false
    }
  },
  
  webhooks: {
    supported: true,
    events: [
      "payment_intent.succeeded",
      "payment_intent.payment_failed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted"
    ],
    signatureHeader: "stripe-signature"
  },
  
  docsUrl: "https://docs.contractspec.com/integrations/stripe",
  setupGuideUrl: "https://stripe.com/docs/keys",
  version: "1.0.0"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">IntegrationConnection</h2>
        <p className="text-muted-foreground">
          An <strong>IntegrationConnection</strong> is a per-tenant instance of
          an integration with configured credentials and environment settings.
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type IntegrationConnection = {
  id: string;
  tenantId: string;
  integrationId: string;
  
  // Environment
  environment: "sandbox" | "production";
  
  // Configuration (non-secret)
  config: Record<string, unknown>;
  
  // Secret reference (encrypted, never exposed)
  secretRef: string;
  
  // Status
  status: "connected" | "disconnected" | "error";
  lastHealthCheck?: string;
  lastHealthCheckStatus?: "success" | "failure";
  lastErrorMessage?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Example: Stripe IntegrationConnection
        </h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`// Production connection
{
  id: "conn_stripe_acme_prod",
  tenantId: "acme-corp",
  integrationId: "stripe",
  environment: "production",
  config: {
    webhookUrl: "https://acme.app/webhooks/stripe"
  },
  secretRef: "secret_stripe_acme_prod_v1",
  status: "connected",
  lastHealthCheck: "2025-01-15T10:30:00Z",
  lastHealthCheckStatus: "success",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-15T10:30:00Z",
  createdBy: "admin@acme.com"
}

// Sandbox connection
{
  id: "conn_stripe_acme_test",
  tenantId: "acme-corp",
  integrationId: "stripe",
  environment: "sandbox",
  config: {
    webhookUrl: "https://sandbox.acme.app/webhooks/stripe"
  },
  secretRef: "secret_stripe_acme_test_v1",
  status: "connected",
  lastHealthCheck: "2025-01-15T10:25:00Z",
  lastHealthCheckStatus: "success",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-15T10:25:00Z",
  createdBy: "dev@acme.com"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Health checks</h2>
        <p className="text-muted-foreground">
          IntegrationConnections are periodically health-checked to ensure they
          remain valid:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>API key validation</strong> - Test that credentials are
            still valid
          </li>
          <li>
            <strong>Connectivity check</strong> - Verify network access to the
            provider
          </li>
          <li>
            <strong>Permission verification</strong> - Ensure required scopes
            are granted
          </li>
          <li>
            <strong>Webhook validation</strong> - Test webhook endpoint
            reachability
          </li>
        </ul>
        <p className="text-muted-foreground">
          Failed health checks update the connection status to "error" and
          trigger alerts.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Secret management</h2>
        <p className="text-muted-foreground">
          Secrets (API keys, tokens) are never stored in plaintext:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>User provides secrets through secure UI or API</li>
          <li>Secrets are encrypted using tenant-specific keys</li>
          <li>
            Encrypted secrets are stored in secure vault (e.g., AWS Secrets
            Manager)
          </li>
          <li>IntegrationConnection stores only a reference (secretRef)</li>
          <li>At runtime, secrets are decrypted on-demand and never logged</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Always maintain separate sandbox and production connections</li>
          <li>
            Use descriptive connection IDs that include tenant and environment
          </li>
          <li>Monitor health check status and set up alerts for failures</li>
          <li>Rotate secrets regularly and update secretRef accordingly</li>
          <li>Document the purpose and ownership of each connection</li>
          <li>Test connections in sandbox before enabling in production</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations" className="btn-ghost">
          Back to Integrations
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
