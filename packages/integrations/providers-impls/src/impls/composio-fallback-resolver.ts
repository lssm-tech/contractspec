import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import type { ComposioConfig, ComposioToolProxy } from './composio-types';
import { resolveToolkit } from './composio-types';
import { ComposioMcpProvider } from './composio-mcp';
import { ComposioSdkProvider } from './composio-sdk';
import {
  ComposioMessagingProxy,
  ComposioEmailProxy,
  ComposioPaymentsProxy,
  ComposioProjectManagementProxy,
  ComposioCalendarProxy,
  ComposioGenericProxy,
} from './composio-proxies';
import type { MessagingProvider } from '../messaging';
import type { EmailOutboundProvider } from '../email';
import type { PaymentsProvider } from '../payments';
import type { ProjectManagementProvider } from '../project-management';
import type { CalendarProvider } from '../calendar';

/**
 * Resolves unsupported integration keys to Composio-backed proxy providers.
 *
 * When IntegrationProviderFactory encounters an unknown key, it delegates
 * to this resolver. The resolver maps the key to a Composio toolkit and
 * returns a domain-typed proxy that translates method calls into Composio
 * tool executions.
 */
export class ComposioFallbackResolver {
  private readonly mcpProvider: ComposioMcpProvider;
  private readonly sdkProvider: ComposioSdkProvider;
  private readonly preferredTransport: 'mcp' | 'sdk';

  constructor(config: ComposioConfig) {
    this.mcpProvider = new ComposioMcpProvider(config);
    this.sdkProvider = new ComposioSdkProvider(config);
    this.preferredTransport = config.preferredTransport;
  }

  /**
   * Returns true for any integration key -- Composio is a universal fallback.
   * The actual availability of the toolkit is checked at execution time.
   */
  canHandle(_integrationKey: string): boolean {
    return true;
  }

  createMessagingProxy(context: IntegrationContext): MessagingProvider {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioMessagingProxy(this.getProxy(), toolkit);
  }

  createEmailProxy(context: IntegrationContext): EmailOutboundProvider {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioEmailProxy(this.getProxy(), toolkit);
  }

  createPaymentsProxy(context: IntegrationContext): PaymentsProvider {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioPaymentsProxy(this.getProxy(), toolkit);
  }

  createProjectManagementProxy(
    context: IntegrationContext
  ): ProjectManagementProvider {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioProjectManagementProxy(this.getProxy(), toolkit);
  }

  createCalendarProxy(context: IntegrationContext): CalendarProvider {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioCalendarProxy(this.getProxy(), toolkit);
  }

  createGenericProxy(context: IntegrationContext): ComposioGenericProxy {
    const toolkit = resolveToolkit(context.spec.meta.key);
    return new ComposioGenericProxy(this.getProxy(), toolkit);
  }

  private getProxy(): ComposioToolProxy {
    return this.preferredTransport === 'sdk'
      ? this.sdkProvider
      : this.mcpProvider;
  }
}
