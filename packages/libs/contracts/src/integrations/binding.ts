export interface AppIntegrationBinding {
  /** Which slot this binding satisfies. */
  slotId: string;
  /** Which IntegrationConnection to use. */
  connectionId: string;
  /** Optional: scope to specific workflows/features. */
  scope?: {
    workflows?: string[];
    features?: string[];
    operations?: string[];
  };
  /** Priority when multiple connections provide same capability. */
  priority?: number;
}

