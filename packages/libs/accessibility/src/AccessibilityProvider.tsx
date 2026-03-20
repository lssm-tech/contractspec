'use client';

import { SRLiveRegionProvider } from '@contractspec/lib.ui-kit-web/ui/live-region';
import { SkipLink } from '@contractspec/lib.ui-kit-web/ui/skip-link';
import * as React from 'react';
import { NextRouteAnnouncer } from './next-route-announcer';
import { A11YPreferencesProvider } from './preferences';

export function AccessibilityProvider({
	children,
	skipTargetId = 'main',
}: {
	children: React.ReactNode;
	skipTargetId?: string;
}) {
	return (
		<A11YPreferencesProvider>
			<SRLiveRegionProvider>
				<SkipLink targetId={skipTargetId} />
				<NextRouteAnnouncer />
				{children}
			</SRLiveRegionProvider>
		</A11YPreferencesProvider>
	);
}
