import { useBundlePlan } from './BundleProvider';

export function BundleRenderer() {
	const plan = useBundlePlan();

	return (
		<div data-bundle-key={plan.bundleKey} data-surface-id={plan.surfaceId}>
			<pre>{JSON.stringify(plan.reasons, null, 2)}</pre>
		</div>
	);
}
