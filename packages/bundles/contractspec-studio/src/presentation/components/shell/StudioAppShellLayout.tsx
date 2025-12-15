'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  AppHeader,
  ButtonLink,
  type HeaderNavItem,
} from '@lssm/lib.design-system';
import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Separator } from '@lssm/lib.ui-kit-web/ui/separator';
import { authClient } from '../../providers/auth/client';
import { useAuthContext } from '../../providers/auth';
import {
  StudioLearningEventNames,
  useStudioLearningEventRecorder,
} from '../../hooks/studio';
import { StudioLearningCoachSheet } from '../learning/journey/StudioLearningCoachSheet';

export const STUDIO_APP_HEADER_OFFSET_PX = 56;

export function StudioAppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, organization } = useAuthContext();
  const pathname = usePathname();
  const { recordFireAndForget } = useStudioLearningEventRecorder();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const moduleId = getStudioRootModuleId(pathname);
    if (!moduleId) return;
    recordFireAndForget({
      name: StudioLearningEventNames.MODULE_NAVIGATED,
      payload: { moduleId, scope: 'studio_root', pathname },
    });
  }, [isAuthenticated, pathname, recordFireAndForget]);

  const nav: HeaderNavItem[] = isAuthenticated
    ? [
        {
          label: 'Projects',
          href: '/studio/projects',
          match: 'startsWith' as const,
        },
        {
          label: 'Learning',
          href: '/studio/learning',
          match: 'startsWith' as const,
        },
        { label: 'Teams', href: '/studio/teams', match: 'startsWith' as const },
        ...(organization?.type === 'PLATFORM_ADMIN'
          ? [
              {
                label: 'Admin',
                href: '/studio/admin',
                match: 'startsWith' as const,
              },
            ]
          : []),
      ]
    : [
        {
          label: 'Features',
          href: '/studio/features',
          match: 'startsWith' as const,
        },
        {
          label: 'Pricing',
          href: '/studio/pricing',
          match: 'startsWith' as const,
        },
        { label: 'Docs', href: '/studio/docs', match: 'startsWith' as const },
      ];

  const header = (
    <AppHeader
      density="compact"
      logo={
        <ButtonLink variant="ghost" href="/studio/projects">
          Studio
        </ButtonLink>
      }
      nav={nav}
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
      {isAuthenticated ? (
        <StudioLearningCoachSheet organizationId={organization?.id ?? null} />
      ) : null}
      <Separator />
      {footer}
    </VStack>
  );
}

function getStudioRootModuleId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'studio') return null;
  const next = parts[1];
  if (!next) return null;
  if (
    next === 'projects' ||
    next === 'learning' ||
    next === 'teams' ||
    next === 'admin'
  )
    return next;
  return null;
}
