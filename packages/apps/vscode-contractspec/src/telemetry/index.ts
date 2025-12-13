/**
 * Telemetry module for ContractSpec VS Code extension.
 *
 * Hybrid approach:
 * - If contractspec.api.baseUrl is configured → send to API /api/telemetry/ingest
 * - Otherwise → send directly to PostHog (if project key is configured)
 *
 * Respects VS Code telemetry settings (disabled when user opts out).
 */

import * as vscode from 'vscode';

export interface TelemetryReporter extends vscode.Disposable {
  sendTelemetryEvent(
    eventName: string,
    properties?: Record<string, string>,
    measurements?: Record<string, number>
  ): void;
}

/**
 * Create a telemetry reporter that respects VS Code settings.
 * Returns undefined if telemetry is disabled.
 */
export function createTelemetryReporter(
  context: vscode.ExtensionContext
): TelemetryReporter | undefined {
  // Check VS Code telemetry setting
  if (!isTelemetryEnabled()) {
    return undefined;
  }

  const clientId = getOrCreateClientId(context);

  return new ContractSpecTelemetryReporter(clientId);
}

/**
 * Check if telemetry is enabled in VS Code settings.
 */
function isTelemetryEnabled(): boolean {
  const telemetryConfig = vscode.workspace.getConfiguration('telemetry');
  const telemetryLevel = telemetryConfig.get<string>('telemetryLevel', 'all');

  // Telemetry is disabled if level is 'off'
  return telemetryLevel !== 'off';
}

/**
 * Get or create a stable anonymous client ID for telemetry.
 */
function getOrCreateClientId(context: vscode.ExtensionContext): string {
  const existingId = context.globalState.get<string>('contractspec.clientId');
  if (existingId) {
    return existingId;
  }

  const newId = generateClientId();
  context.globalState.update('contractspec.clientId', newId);
  return newId;
}

/**
 * Generate a random client ID (UUID-like).
 */
function generateClientId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class ContractSpecTelemetryReporter implements TelemetryReporter {
  private readonly clientId: string;
  private disposed = false;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  sendTelemetryEvent(
    eventName: string,
    properties?: Record<string, string>,
    measurements?: Record<string, number>
  ): void {
    if (this.disposed) {
      return;
    }

    // Re-check telemetry setting (user may have changed it)
    if (!isTelemetryEnabled()) {
      return;
    }

    const config = vscode.workspace.getConfiguration('contractspec');
    const apiBaseUrl = config.get<string>('api.baseUrl', '');

    const payload = {
      event: eventName,
      distinct_id: this.clientId,
      properties: {
        ...properties,
        ...measurements,
        $lib: 'contractspec-vscode',
        $lib_version:
          vscode.extensions.getExtension('lssm.contractspec')?.packageJSON
            .version ?? '0.0.0',
        vscode_version: vscode.version,
        platform: process.platform,
      },
      timestamp: new Date().toISOString(),
    };

    if (apiBaseUrl) {
      // Send via API
      this.sendViaApi(apiBaseUrl, payload).catch(() => {
        // Silently ignore errors - telemetry should not disrupt user
      });
    } else {
      // Send directly to PostHog
      this.sendDirectToPostHog(payload).catch(() => {
        // Silently ignore errors
      });
    }
  }

  private async sendViaApi(
    baseUrl: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    const url = `${baseUrl.replace(/\/$/, '')}/api/telemetry/ingest`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-contractspec-client-id': this.clientId,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Telemetry API returned ${response.status}`);
    }
  }

  private async sendDirectToPostHog(
    payload: Record<string, unknown>
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration('contractspec');
    const posthogHost = config.get<string>(
      'telemetry.posthogHost',
      'https://eu.posthog.com'
    );
    const posthogKey = config.get<string>('telemetry.posthogProjectKey', '');

    if (!posthogKey) {
      // No PostHog key configured, skip telemetry
      return;
    }

    const url = `${posthogHost}/capture/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: posthogKey,
        ...payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`PostHog returned ${response.status}`);
    }
  }

  dispose(): void {
    this.disposed = true;
  }
}
