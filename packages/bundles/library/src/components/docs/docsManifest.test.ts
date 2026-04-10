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
		]) {
			expect(
				getDocsPageByHref(href) != null || NON_MANIFEST_DOC_ROUTES.has(href)
			).toBe(true);
		}
	});
});
