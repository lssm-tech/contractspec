'use client';

import type { SerializedDataViewSpec } from '@contractspec/bundle.library/features';
import { FeatureDataViewDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
	DataViewRef,
	FeatureModuleSpec,
} from '@contractspec/lib.contracts-spec/features';

export interface FeatureDataViewDetailClientProps {
	feature: FeatureModuleSpec;
	viewKey: string;
	view?: DataViewRef;
	spec?: SerializedDataViewSpec;
}

/**
 * Client component wrapper for FeatureDataViewDetailTemplate.
 * Handles client-side navigation (back) for the data view detail page.
 */
export function FeatureDataViewDetailClient({
	feature,
	viewKey,
	view,
	spec,
}: FeatureDataViewDetailClientProps) {
	return (
		<FeatureDataViewDetailTemplate
			feature={feature}
			viewKey={viewKey}
			view={view}
			spec={spec}
		/>
	);
}
