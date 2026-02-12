/**
 * Type declaration shim for optional peer dependency @posthog/ai.
 *
 * @posthog/ai is an optional peer dependency used for LLM Analytics tracing.
 * This shim satisfies the TypeScript compiler for the dynamic import in
 * telemetry/posthog.ts without requiring the package to be installed.
 */
declare module '@posthog/ai' {
  export function withTracing(
    model: unknown,
    client: unknown,
    options?: unknown
  ): unknown;
}

declare module 'posthog-node' {
  export class PostHog {
    constructor(apiKey: string, options?: { host?: string });
    capture(params: {
      distinctId: string;
      event: string;
      properties?: Record<string, unknown>;
      groups?: Record<string, string>;
    }): void;
    shutdown(): Promise<void>;
  }
}
