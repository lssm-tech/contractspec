'use client';

import * as React from 'react';
import { A11YPreferencesProvider } from './preferences';
import { SRLiveRegionProvider } from '@lssm/lib.ui-kit-web/ui/live-region';
import { NextRouteAnnouncer } from './next-route-announcer';
import { SkipLink } from '@lssm/lib.ui-kit-web/ui/skip-link';

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
