import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Integrations: ContractSpec Docs',
//   description:
//     'Connect ContractSpec to payments, email, AI, storage, and other services through built-in integrations.',
// };

export function IntegrationsOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          ContractSpec provides first-class integration support through a
          spec-first architecture. Integrations are defined globally, connected
          per-tenant, and bound to apps through typed specifications, ensuring
          type-safe, policy-enforced access to external services.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Spec-first architecture</h2>
        <p className="text-muted-foreground">
          Integrations in ContractSpec follow a three-layer model:
        </p>
        <div className="space-y-3">
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">1. IntegrationSpec (Global)</h3>
            <p className="text-muted-foreground text-sm">
              Defines what an integration provides: capabilities, configuration
              schema, secrets, webhooks, and requirements.
            </p>
            <Link
              href="/docs/integrations/spec-model"
              className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more →
            </Link>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">
              2. IntegrationConnection (Per-Tenant)
            </h3>
            <p className="text-muted-foreground text-sm">
              A tenant's configured connection with credentials, environment
              (sandbox/production), and health status.
            </p>
            <Link
              href="/docs/architecture/integration-binding"
              className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more →
            </Link>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">
              3. AppIntegrationBinding (Per-App)
            </h3>
            <p className="text-muted-foreground text-sm">
              Maps tenant connections to app capabilities and workflows,
              defining which operations can use which integrations.
            </p>
            <Link
              href="/docs/architecture/integration-binding"
              className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integration categories</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type IntegrationCategory =
  | "payments"      // Stripe
  | "open-banking"  // Powens
  | "email"         // Postmark, Resend, Gmail
  | "calendar"      // Google Calendar
  | "sms"           // Twilio
  | "messaging"     // Slack, GitHub, WhatsApp
  | "health"        // Whoop, Oura, Strava, Fitbit
  | "ai-llm"        // OpenAI, Mistral
  | "ai-voice-tts"  // ElevenLabs
  | "ai-voice-stt"  // OpenAI Whisper, Mistral Voxtral
  | "ai-voice-conversational" // OpenAI Realtime, Mistral Voice
  | "ai-image"      // OpenAI Image, Fal
  | "vector-db"     // Qdrant
  | "database"      // Supabase Postgres
  | "storage"       // S3-compatible
  | "meeting-recorder" // Fireflies, tl;dv
  | "project-management" // Linear, Jira, Notion
  | "accounting"    // Coming soon
  | "crm"           // Coming soon
  | "helpdesk"      // Coming soon
  | "custom";       // User-defined`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available integrations</h2>
        <div className="space-y-6">
          {/* Payments */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Payments</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/stripe"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Stripe
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Payment processing, subscriptions, and invoicing
                </p>
              </Link>
            </div>
          </div>

          {/* Open Banking */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Open Banking</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/powens"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Powens (Read-Only)
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Account, transaction, and balance synchronisation via Powens
                  with tenant-owned credentials.
                </p>
              </Link>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Email</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/postmark"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Postmark
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Transactional email delivery with high deliverability
                </p>
              </Link>
              <Link
                href="/docs/integrations/resend"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Resend
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Modern email API for developers
                </p>
              </Link>
              <Link
                href="/docs/integrations/gmail"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Gmail API
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Inbound email processing and thread management
                </p>
              </Link>
            </div>
          </div>

          {/* Calendar & Scheduling */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Calendar & Scheduling</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/google-calendar"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Google Calendar
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Event scheduling and calendar management
                </p>
              </Link>
            </div>
          </div>

          {/* AI & Machine Learning */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">AI & Machine Learning</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/openai"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  OpenAI
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  LLMs, embeddings, and Whisper speech-to-text
                </p>
              </Link>
              <Link
                href="/docs/integrations/mistral"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Mistral
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  LLMs, embeddings, Voxtral STT, and conversational voice
                </p>
              </Link>
              <Link
                href="/docs/integrations/elevenlabs"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  ElevenLabs
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Text-to-speech and voice synthesis
                </p>
              </Link>
              <Link
                href="/docs/integrations/qdrant"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Qdrant
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Vector database for semantic search and RAG
                </p>
              </Link>
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Storage</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/s3"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  S3-Compatible Storage
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Object storage (AWS S3, Scaleway, MinIO, etc.)
                </p>
              </Link>
            </div>
          </div>

          {/* SMS */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">SMS</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/twilio"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Twilio
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  SMS notifications and transactional messaging
                </p>
              </Link>
            </div>
          </div>

          {/* Messaging channels */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Messaging channels</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/slack"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Slack
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Signed event ingestion and outbox-backed replies
                </p>
              </Link>
              <Link
                href="/docs/integrations/github"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  GitHub
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Issue and PR comment workflows with webhook verification
                </p>
              </Link>
              <Link
                href="/docs/integrations/whatsapp-meta"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  WhatsApp Meta
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Primary WhatsApp Business API transport for inbound and
                  outbound
                </p>
              </Link>
              <Link
                href="/docs/integrations/whatsapp-twilio"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  WhatsApp Twilio
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Fallback WhatsApp route with Twilio signature validation
                </p>
              </Link>
            </div>
          </div>

          {/* Health */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Health & wearables</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/docs/integrations/health-routing"
                className="card-subtle group p-4 transition-colors hover:border-violet-500/50"
              >
                <h4 className="font-bold transition-colors group-hover:text-violet-400">
                  Health routing strategy
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Official vs aggregator transport order, unofficial gating, and
                  OAuth refresh config
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How integrations work</h2>
        <p className="text-muted-foreground">
          ContractSpec integrations are implemented as{' '}
          <Link
            href="/docs/specs/capabilities"
            className="text-violet-400 hover:text-violet-300"
          >
            capability providers
          </Link>
          . This means:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Type safety</strong> – All API calls are type-checked by
            TypeScript and validated at runtime via Zod
          </li>
          <li>
            <strong>Policy enforcement</strong> – Access to external services is
            governed by your{' '}
            <Link
              href="/docs/specs/policy"
              className="text-violet-400 hover:text-violet-300"
            >
              PolicySpecs
            </Link>
          </li>
          <li>
            <strong>Audit logging</strong> – All integration calls are
            automatically logged
          </li>
          <li>
            <strong>Error handling</strong> – Built-in retries and fallback
            strategies
          </li>
          <li>
            <strong>Environment-based config</strong> – API keys and secrets are
            managed through environment variables
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Secret management</h2>
        <p className="text-muted-foreground">
          Secrets are resolved through a layered secret provider manager. It
          checks lightweight environment overrides first, then falls back to a
          managed vault (Google Cloud Secret Manager) for production.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-subtle p-4">
            <h3 className="text-xl font-semibold">Environment variables</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Perfect for local development and secure staging overrides. Use
              the <code>env://</code> scheme or append <code>?env=</code> to
              another reference to map an explicit variable.
            </p>
            <div className="bg-background/60 border-border mt-3 overflow-auto rounded-lg border p-3 font-mono text-xs">
              <pre className="whitespace-pre-wrap">{`# Override a production secret locally
CONTRACTSPEC__SECRET__STRIPE=sk_test_123

# Reference
env://CONTRACTSPEC__SECRET__STRIPE`}</pre>
            </div>
          </div>
          <div className="card-subtle p-4">
            <h3 className="text-xl font-semibold">GCP Secret Manager</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Used in production to store versioned credentials with rotation
              support. References follow the{' '}
              <code>gcp://projects/.../secrets/.../versions/latest</code>{' '}
              format.
            </p>
            <div className="bg-background/60 border-border mt-3 overflow-auto rounded-lg border p-3 font-mono text-xs">
              <pre className="whitespace-pre-wrap">{`# Production reference
gcp://projects/tenant/secrets/stripe-secret-key/versions/latest`}</pre>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          The secret manager chooses the first provider that can resolve a
          reference, so local environment variables can override the managed
          vault without changing blueprints or tenant configs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuration</h2>
        <p className="text-muted-foreground">
          Integrations are configured through environment variables and secret
          references. Here's a typical setup:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

POSTMARK_API_TOKEN=...
POSTMARK_FROM_EMAIL=noreply@example.com

OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION=org-...

MISTRAL_API_KEY=...

QDRANT_URL=https://...
QDRANT_API_KEY=...

S3_ENDPOINT=https://s3.fr-par.scw.cloud
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=my-bucket
S3_REGION=fr-par

# Secret references
STRIPE_SECRET_REF=gcp://projects/tenant/secrets/stripe-secret-key/versions/latest
STRIPE_SECRET_OVERRIDE=env://STRIPE_SECRET_KEY`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integration categories</h2>
        <p className="text-muted-foreground">
          ContractSpec supports the following integration categories:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`type IntegrationCategory =
  | "payments"        // Stripe, PayPal, etc.
  | "open-banking"    // Powens and open banking providers
  | "email"           // Postmark, Resend, Gmail
  | "calendar"        // Google Calendar, Outlook
  | "sms"             // Twilio, MessageBird
  | "messaging"       // Slack, GitHub, WhatsApp
  | "health"          // Whoop, Oura, Strava, Fitbit
  | "ai-llm"          // OpenAI, Anthropic, Cohere, Mistral
  | "ai-voice-tts"    // ElevenLabs, Google TTS
  | "ai-voice-stt"    // OpenAI Whisper, Google STT, Mistral Voxtral
  | "ai-voice-conversational" // OpenAI Realtime, Mistral Voice
  | "ai-image"        // OpenAI Image, Fal
  | "vector-db"       // Qdrant, Pinecone, Weaviate
  | "database"        // Supabase, Postgres
  | "storage"         // S3, GCS, Azure Blob
  | "meeting-recorder" // Fireflies, tl;dv, Granola
  | "project-management" // Linear, Jira, Notion
  | "accounting"      // QuickBooks, Xero (coming soon)
  | "crm"             // Salesforce, HubSpot (coming soon)
  | "helpdesk"        // Zendesk, Intercom (coming soon)
  | "custom";         // Your own integrations`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Custom integrations</h2>
        <p className="text-muted-foreground">
          You can create custom integrations by implementing a capability
          provider. See the{' '}
          <Link
            href="/docs/advanced/custom-providers"
            className="text-violet-400 hover:text-violet-300"
          >
            Custom Providers
          </Link>{' '}
          guide for details.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/stripe" className="btn-primary">
          Get Started with Stripe <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
