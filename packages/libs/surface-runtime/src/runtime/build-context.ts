import type {
	BuildContextParams,
	BundleContext,
	PreferenceDimensions,
} from '../spec/types';

const DEFAULT_PREFERENCES: PreferenceDimensions = {
	guidance: 'hints',
	density: 'standard',
	dataDepth: 'detailed',
	control: 'standard',
	media: 'text',
	pace: 'balanced',
	narrative: 'top-down',
};

/**
 * Builds a full BundleContext from minimal request params.
 * Missing fields use sensible defaults for resolution.
 *
 * @param params - Minimal request params (route required)
 * @returns Full BundleContext
 */
export function buildContext(params: BuildContextParams): BundleContext {
	const {
		route,
		params: routeParams = {},
		query = {},
		tenantId = 'default',
		workspaceId,
		actorId,
		device = 'desktop',
		preferences: partialPrefs = {},
		capabilities = [],
		featureFlags = [],
		mode,
		locale,
		timezone,
		entity,
		conversation,
		activeViewId,
	} = params;

	const preferences: PreferenceDimensions = {
		...DEFAULT_PREFERENCES,
		...partialPrefs,
	};

	return {
		tenantId,
		workspaceId,
		actorId,
		route,
		params: routeParams,
		query,
		device,
		mode,
		locale,
		timezone,
		entity,
		conversation,
		activeViewId,
		preferences,
		capabilities,
		featureFlags,
	};
}
