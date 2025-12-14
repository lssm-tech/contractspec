'use client';

import * as React from 'react';
import { AppHeader, ButtonLink } from '@lssm/lib.design-system';
import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Separator } from '@lssm/lib.ui-kit-web/ui/separator';
import { authClient } from '../../providers/auth/client';
import { useAuthContext } from '../../providers/auth';

export const STUDIO_APP_HEADER_OFFSET_PX = 56;

export function StudioAppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, organization } = useAuthContext();

  const header = (
    <AppHeader
      density="compact"
      logo={
        <ButtonLink variant="ghost" href="/studio/projects">
          Studio
        </ButtonLink>
      }
      nav={
        isAuthenticated
          ? [
              {
                label: 'Projects',
                href: '/studio/projects',
                match: 'startsWith',
              },
              {
                label: 'Learning',
                href: '/studio/learning',
                match: 'startsWith',
              },
              { label: 'Teams', href: '/studio/teams', match: 'startsWith' },
            ]
          : [
              {
                label: 'Features',
                href: '/studio/features',
                match: 'startsWith',
              },
              {
                label: 'Pricing',
                href: '/studio/pricing',
                match: 'startsWith',
              },
              { label: 'Docs', href: '/studio/docs', match: 'startsWith' },
            ]
      }
      userMenu={
        isAuthenticated
          ? {
              name: (user as { name?: string } | null)?.name,
              email: (user as { email?: string } | null)?.email,
              items: [
                {
                  label: organization
                    ? `Org: ${organization.name}`
                    : 'Organization',
                  href: '/onboarding/org-select',
                },
                {
                  label: 'Switch organization',
                  href: '/onboarding/org-select',
                },
                {
                  label: 'Sign out',
                  danger: true,
                  onClick: () => {
                    void authClient.signOut({
                      fetchOptions: { credentials: 'include' },
                    });
                  },
                },
              ],
            }
          : undefined
      }
      cta={
        isAuthenticated
          ? undefined
          : { label: 'Sign in', href: '/login', variant: 'outline' }
      }
    />
  );

  const footer = (
    <VStack gap="sm" className="mx-auto w-full max-w-7xl px-4 py-6">
      <p className="text-muted-foreground text-xs">
        ContractSpec Studio{organization ? ` · ${organization.name}` : ''}
      </p>
    </VStack>
  );

  return (
    <VStack
      gap="none"
      className="bg-background min-h-svh"
      style={
        {
          ['--studio-app-header-offset' as string]: `${STUDIO_APP_HEADER_OFFSET_PX}px`,
        } as React.CSSProperties
      }
    >
      {header}
      <main className="flex-1">{children}</main>
      <Separator />
      {footer}
    </VStack>
  );
}
