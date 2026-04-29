import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { IntegrationHubCredentialSetupPreview } from './IntegrationHubCredentialSetupPreview';

describe('IntegrationHubCredentialSetupPreview', () => {
	it('renders managed and BYOK setup guidance for monorepo apps', () => {
		const html = renderToStaticMarkup(
			<IntegrationHubCredentialSetupPreview mode="byok" />
		);

		expect(html).toContain('BYOK and monorepo env setup');
		expect(html).toContain('Managed');
		expect(html).toContain('BYOK');
		expect(html).toContain('NEXT_PUBLIC_INTEGRATION_HUB_ORIGIN');
		expect(html).toContain('EXPO_PUBLIC_INTEGRATION_HUB_ORIGIN');
		expect(html).toContain('NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY');
		expect(html).toContain('EXPO_PUBLIC_POSTHOG_PROJECT_API_KEY');
		expect(html).toContain('env://POSTHOG_PERSONAL_API_KEY');
		expect(html).toContain('Missing BYOK secret refs: WebhookSecret.');
		expect(html).toContain('Secret fields stay server-only');
		expect(html).not.toContain('NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY');
		expect(html).not.toContain('EXPO_PUBLIC_POSTHOG_PERSONAL_API_KEY');
		expect(html).not.toContain('sk_live');
	});
});
