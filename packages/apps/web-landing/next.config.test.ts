import { describe, expect, it } from 'bun:test';
import nextConfig from './next.config.mjs';

describe('web-landing Next.js tracing config', () => {
	it('does not blanket-exclude sandbox or templates from output file tracing because those public routes need SSR chunks packaged for deployment', () => {
		const outputFileTracingExcludes =
			'outputFileTracingExcludes' in nextConfig
				? nextConfig.outputFileTracingExcludes
				: undefined;

		expect(outputFileTracingExcludes?.['/sandbox']).not.toEqual(['**/*']);
		expect(outputFileTracingExcludes?.['/templates']).not.toEqual(['**/*']);
	});

	it('transpiles workspace packages used by templates, examples, and sandbox previews', () => {
		expect(nextConfig.transpilePackages).toEqual(
			expect.arrayContaining([
				'@contractspec/bundle.library',
				'@contractspec/bundle.marketing',
				'@contractspec/module.examples',
				'@contractspec/lib.example-shared-ui',
				'@contractspec/example.agent-console',
				'@contractspec/example.ai-chat-assistant',
				'@contractspec/example.analytics-dashboard',
				'@contractspec/example.crm-pipeline',
				'@contractspec/example.data-grid-showcase',
				'@contractspec/example.in-app-docs',
				'@contractspec/example.integration-hub',
				'@contractspec/example.learning-journey-registry',
				'@contractspec/example.marketplace',
				'@contractspec/example.policy-safe-knowledge-assistant',
				'@contractspec/example.saas-boilerplate',
				'@contractspec/example.visualization-showcase',
				'@contractspec/example.workflow-system',
			])
		);
	});
});
