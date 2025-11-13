import type { CapabilityRef } from '../capabilities';

export interface AppIntegrationBinding {
  /** Which IntegrationConnection to use. */
  connectionId: string;
  /** Which capabilities this binding satisfies for this app. */
  satisfiesCapabilities: CapabilityRef[];
  /** Optional: scope to specific workflows/features. */
  scope?: {
    workflows?: string[];
    features?: string[];
    operations?: string[];
  };
  /** Priority when multiple connections provide same capability. */
  priority?: number;
}

