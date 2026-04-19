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
});
