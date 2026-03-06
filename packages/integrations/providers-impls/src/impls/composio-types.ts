/**
 * Shared types for the Composio fallback integration layer.
 *
 * These types are used by ComposioMcpProvider, ComposioSdkProvider,
 * ComposioFallbackResolver, and the domain proxy adapters.
 */

export interface ComposioConfig {
  apiKey: string;
  baseUrl?: string;
  preferredTransport: "mcp" | "sdk";
}

export interface ComposioSessionInfo {
  userId: string;
  mcpUrl: string;
  mcpHeaders: Record<string, string>;
  createdAt: number;
}

export interface ComposioToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface ComposioToolProxy {
  executeTool(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<ComposioToolResult>;
  searchTools(query: string): Promise<ComposioToolDescriptor[]>;
}

export interface ComposioToolDescriptor {
  name: string;
  description: string;
  toolkit: string;
  parameters: Record<string, unknown>;
}

/**
 * Maps ContractSpec integration key prefixes to Composio toolkit names.
 * Keys are the domain prefix from integration keys (e.g. "messaging" from "messaging.discord").
 */
export const INTEGRATION_KEY_TO_TOOLKIT: Record<string, string> = {
  "payments": "stripe",
  "email": "gmail",
  "calendar": "googlecalendar",
  "sms": "twilio",
  "messaging.slack": "slack",
  "messaging.github": "github",
  "messaging.discord": "discord",
  "messaging.teams": "microsoft_teams",
  "analytics.posthog": "posthog",
  "project-management.linear": "linear",
  "project-management.jira": "jira",
  "project-management.notion": "notion",
  "project-management.asana": "asana",
  "project-management.trello": "trello",
  "project-management.monday": "monday",
  "storage.s3": "aws",
  "storage.gcs": "google_cloud",
  "storage.gdrive": "googledrive",
  "storage.dropbox": "dropbox",
  "storage.onedrive": "onedrive",
  "crm.salesforce": "salesforce",
  "crm.hubspot": "hubspot",
  "crm.pipedrive": "pipedrive",
  "database.supabase": "supabase",
  "vectordb.supabase": "supabase",
  "ai-llm": "openai",
};

const SESSION_TTL_MS = 30 * 60 * 1000;

export function isSessionExpired(session: ComposioSessionInfo): boolean {
  return Date.now() - session.createdAt > SESSION_TTL_MS;
}

/**
 * Extracts the Composio toolkit name from a ContractSpec integration key.
 * Falls back to the provider suffix (e.g. "discord" from "messaging.discord").
 */
export function resolveToolkit(integrationKey: string): string {
  if (INTEGRATION_KEY_TO_TOOLKIT[integrationKey]) {
    return INTEGRATION_KEY_TO_TOOLKIT[integrationKey];
  }

  for (const [prefix, toolkit] of Object.entries(INTEGRATION_KEY_TO_TOOLKIT)) {
    if (integrationKey.startsWith(prefix)) {
      return toolkit;
    }
  }

  const parts = integrationKey.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : integrationKey;
}
