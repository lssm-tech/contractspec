import type {
	BundleContext,
	LayoutBlueprintSpec,
	ModuleBundleSpec,
	SurfaceNode,
	SurfaceSpec,
} from '../spec/types';

export interface ResolvedSurfacePlan {
	bundleKey: string;
	surfaceId: string;
	layoutId: string;
	nodes: SurfaceNode[];
	bindings: Record<string, unknown>;
	reasons: string[];
}

function selectSurface<C extends BundleContext>(
	spec: ModuleBundleSpec<C>,
	ctx: C
): SurfaceSpec<C> {
	const route =
		spec.routes.find((route) => route.path === ctx.route) ?? spec.routes[0];
	if (!route) {
		throw new Error('No routes declared in bundle spec.');
	}
	const surface = spec.surfaces[route.defaultSurface];
	if (!surface) {
		throw new Error(`Default surface "${route.defaultSurface}" was not found.`);
	}
	return surface;
}

function selectLayout<C extends BundleContext>(
	surface: SurfaceSpec<C>,
	ctx: C
): LayoutBlueprintSpec<C> {
	const layout =
		surface.layouts.find((candidate) => candidate.when?.(ctx) ?? true) ??
		surface.layouts[0];
	if (!layout) {
		throw new Error(`Surface "${surface.surfaceId}" has no layouts.`);
	}
	return layout;
}

export async function resolveBundle<C extends BundleContext>(
	spec: ModuleBundleSpec<C>,
	ctx: C
): Promise<ResolvedSurfacePlan> {
	const surface = selectSurface(spec, ctx);
	const layout = selectLayout(surface, ctx);

	return {
		bundleKey: spec.meta.key,
		surfaceId: surface.surfaceId,
		layoutId: layout.layoutId,
		nodes: [],
		bindings: {},
		reasons: [
			`surface=${surface.surfaceId}`,
			`layout=${layout.layoutId}`,
			`density=${ctx.preferences.density}`,
			`narrative=${ctx.preferences.narrative}`,
		],
	};
}
