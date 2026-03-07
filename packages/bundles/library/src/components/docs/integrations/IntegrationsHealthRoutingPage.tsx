import Link from '@contractspec/lib.ui-link';

export function IntegrationsHealthRoutingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Health Routing Strategy</h1>
        <p className="text-muted-foreground">
          Health integrations resolve providers through deterministic transport
          strategy order with explicit capability gating and unofficial-route
          controls.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Connection config fields</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`{
  "defaultTransport": "official-api",
  "strategyOrder": [
    "official-api",
    "official-mcp",
    "aggregator-api",
    "aggregator-mcp",
    "unofficial"
  ],
  "allowUnofficial": false,
  "unofficialAllowList": ["health.peloton"],
  "apiBaseUrl": "https://api.provider.example",
  "mcpUrl": "https://mcp.provider.example",
  "oauthTokenUrl": "https://api.provider.example/oauth/token"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Secret payload fields</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`{
  "apiKey": "...",
  "accessToken": "...",
  "refreshToken": "...",
  "clientId": "...",
  "clientSecret": "...",
  "tokenExpiresAt": "2026-02-01T00:00:00.000Z",
  "mcpAccessToken": "...",
  "webhookSecret": "..."
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Routing behavior</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Unsupported strategies are skipped per provider capability matrix.
          </li>
          <li>
            Missing credentials fail closed and fall through only when a later
            strategy is valid.
          </li>
          <li>
            Unofficial routes are disabled unless
            <code className="bg-background/50 ml-1 rounded px-2 py-1">
              allowUnofficial
            </code>
            is true.
          </li>
          <li>
            When
            <code className="bg-background/50 ml-1 rounded px-2 py-1">
              unofficialAllowList
            </code>
            is set, only listed provider keys can route unofficially.
          </li>
          <li>
            OAuth refresh uses
            <code className="bg-background/50 ml-1 rounded px-2 py-1">
              oauthTokenUrl
            </code>
            with refresh/client credentials when APIs return 401.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Provider guidance</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use official APIs when available (Whoop, Oura, Strava, Fitbit).
          </li>
          <li>
            Use aggregator routing for providers without stable official APIs
            (Garmin, MyFitnessPal, Eight Sleep, Peloton).
          </li>
          <li>
            Keep unofficial automation opt-in and auditable for production.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/whatsapp-twilio" className="btn-ghost">
          Previous: WhatsApp Twilio
        </Link>
        <Link href="/docs/integrations" className="btn-primary">
          Back to Integrations
        </Link>
      </div>
    </div>
  );
}
