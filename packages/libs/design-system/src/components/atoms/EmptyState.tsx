'use client';

import {
	type EmptyStateProps,
	EmptyState as WebEmptyState,
} from '@contractspec/lib.ui-kit-web/ui/empty-state';

export function EmptyState(props: EmptyStateProps) {
	return <WebEmptyState {...props} />;
}
