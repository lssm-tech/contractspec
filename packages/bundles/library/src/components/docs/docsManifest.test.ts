import { describe, expect, it } from 'bun:test';
import { getDocsPageByHref, getPrimaryDocsSections } from './docsManifest';

const NON_MANIFEST_DOC_ROUTES = new Set(['/docs/architecture/control-plane']);

describe('docs manifest learning paths', () => {
	it('registers the canonical spec-pack pages', () => {
		for (const href of [
			'/docs/specs/connect',
			'/docs/specs/module-bundles',
			'/docs/specs/builder-control-plane',
		]) {
			expect(getDocsPageByHref(href)).toBeDefined();
		}
	});

	it('registers the practical guides in the build section', () => {
		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);

		expect(buildSection).toBeDefined();

		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(buildHrefs).toContain('/docs/guides/connect-in-a-repo');
		expect(buildHrefs).toContain('/docs/guides/first-module-bundle');
		expect(buildHrefs).toContain('/docs/guides/host-builder-workbench');
	});

	it('promotes DataView tutorial and preference docs in primary navigation', () => {
		expect(getDocsPageByHref('/docs/getting-started/dataviews')).toBeDefined();
		expect(getDocsPageByHref('/docs/libraries/data-views')).toBeDefined();
		expect(getDocsPageByHref('/docs/libraries/personalization')).toBeDefined();
		expect(
			getDocsPageByHref('/docs/libraries/personalization')?.aliases
		).toContain('resolveDataViewPreferences');

		const startSection = getPrimaryDocsSections().find(
			(section) => section.key === 'start'
		);
		const startHrefs = startSection?.items.map((item) => item.href) ?? [];

		expect(startHrefs).toContain('/docs/getting-started/dataviews');
		expect(startHrefs.indexOf('/docs/getting-started/dataviews')).toBeLessThan(
			startHrefs.indexOf('/docs/getting-started/troubleshooting')
		);

		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);
		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(buildHrefs).toContain('/docs/libraries/data-views');
		expect(buildHrefs).toContain('/docs/libraries/personalization');
		expect(buildHrefs.indexOf('/docs/libraries/data-views')).toBeGreaterThan(
			buildHrefs.indexOf('/docs/libraries')
		);
		expect(
			buildHrefs.indexOf('/docs/libraries/personalization')
		).toBeGreaterThan(buildHrefs.indexOf('/docs/libraries/data-views'));
	});

	it('registers the translation runtime guide for i18n and i18next adoption', () => {
		const page = getDocsPageByHref('/docs/libraries/translation-runtime');

		expect(page).toBeDefined();
		expect(page?.aliases).toContain('i18next adapter');
		expect(page?.description).toContain('i18next');

		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);
		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(buildHrefs).toContain('/docs/libraries/translation-runtime');
		expect(
			buildHrefs.indexOf('/docs/libraries/translation-runtime')
		).toBeGreaterThan(buildHrefs.indexOf('/docs/libraries'));
	});

	it('promotes the design-system guide for object references and adaptive panels', () => {
		const page = getDocsPageByHref('/docs/libraries/design-system');

		expect(page).toBeDefined();
		expect(page?.aliases).toContain('ObjectReferenceHandler');
		expect(page?.aliases).toContain('AdaptivePanel');

		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);
		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(buildHrefs).toContain('/docs/libraries/design-system');
		expect(buildHrefs.indexOf('/docs/libraries/design-system')).toBeGreaterThan(
			buildHrefs.indexOf('/docs/libraries/application-shell')
		);
		expect(buildHrefs.indexOf('/docs/libraries/design-system')).toBeLessThan(
			buildHrefs.indexOf('/docs/architecture')
		);
	});

	it('keeps cross-platform UI resolvable without promoting it to primary nav', () => {
		expect(
			getDocsPageByHref('/docs/libraries/cross-platform-ui')
		).toBeDefined();

		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);
		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(buildHrefs).not.toContain('/docs/libraries/cross-platform-ui');
	});

	it('orders the new guides as intended within build traversal', () => {
		const buildSection = getPrimaryDocsSections().find(
			(section) => section.key === 'build'
		);
		const buildHrefs = buildSection?.items.map((item) => item.href) ?? [];

		expect(
			buildHrefs.indexOf('/docs/guides/first-module-bundle')
		).toBeGreaterThan(
			buildHrefs.indexOf('/docs/guides/docs-generation-pipeline')
		);
		expect(
			buildHrefs.indexOf('/docs/guides/host-builder-workbench')
		).toBeGreaterThan(buildHrefs.indexOf('/docs/guides/first-module-bundle'));
		expect(
			buildHrefs.indexOf('/docs/guides/connect-in-a-repo')
		).toBeGreaterThan(
			buildHrefs.indexOf('/docs/guides/host-builder-workbench')
		);
	});

	it('keeps related-page doc links pointed at valid docs routes', () => {
		for (const href of [
			'/docs/specs/connect',
			'/docs/guides/connect-in-a-repo',
			'/docs/specs/module-bundles',
			'/docs/guides/first-module-bundle',
			'/docs/specs/builder-control-plane',
			'/docs/guides/host-builder-workbench',
			'/docs/architecture',
			'/docs/architecture/control-plane',
			'/docs/specs/overlays',
			'/docs/studio',
			'/docs/libraries/translation-runtime',
			'/docs/libraries/cross-platform-ui',
			'/docs/libraries/design-system',
			'/docs/libraries/data-views',
			'/docs/libraries/personalization',
			'/docs/getting-started/dataviews',
		]) {
			expect(
				getDocsPageByHref(href) != null || NON_MANIFEST_DOC_ROUTES.has(href)
			).toBe(true);
		}
	});
});
