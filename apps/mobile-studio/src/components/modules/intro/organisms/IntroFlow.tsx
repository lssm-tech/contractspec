/**
 * IntroFlow
 *
 * Onboarding introduction flow with a few slides explaining the app.
 * Next.js compatibility: Client-only UI. Replaces RN View with UI-kit stacks.
 */
import React, { useMemo, useState } from 'react';
import { H1, P } from '@contractspec/lib.ui-kit/ui/typography';
import { Button } from '@contractspec/lib.design-system';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { HStack, VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Card, CardContent } from '@contractspec/lib.ui-kit/ui/card';
import { ScrollableScreen } from '../../../design-system/atoms/ScrollableScreen';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import { useT } from '@contractspec/lib.translation-studio/native';
import { LanguageSwitcher } from '../../../design-system/atoms/LanguageSwitcher';

interface IntroSlide {
  title: string;
  subtitle?: string;
  bullets?: string[];
}

export function IntroFlow() {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useT(['landing']);
  const slides: IntroSlide[] = useMemo(
    () => [
      {
        title: t('appMobile:intro.simple.title', 'Artisan, made simple'),
        subtitle: t(
          'appMobile:intro.simple.subtitle',
          'ArtisanOS, an all-in-one tool for craftman: from prospecting to invoices, client management, scheduling, payments, and more'
        ),
        bullets: [
          t(
            'appMobile:intro.simple.bullets.0',
            'Prospecting: find new clients and projects'
          ),
          t(
            'appMobile:intro.simple.bullets.1',
            'Client management: follow up with clients and projects'
          ),
          t(
            'appMobile:intro.simple.bullets.2',
            'Scheduling: schedule appointments and tasks'
          ),
        ],
      },
      {
        title: t(
          'appMobile:intro.crm.title',
          'Customer Relationship Management'
        ),
        subtitle: t(
          'appMobile:intro.crm.subtitle',
          'Manage your clients and projects with a CRM system that adapts to your needs.'
        ),
        bullets: [
          t(
            'appMobile:intro.crm.bullets.0',
            'Keep track of your clients and projects'
          ),
          t(
            'appMobile:intro.crm.bullets.1',
            'Follow up with clients and projects'
          ),
          t(
            'appMobile:intro.crm.bullets.2',
            'Get insights on your clients and projects'
          ),
        ],
      },
      {
        title: t('appMobile:intro.inControl.title', 'You are in control'),
        subtitle: t(
          'appMobile:intro.inControl.subtitle',
          'Manually or AI-powered, you are in control of your data and your business.'
        ),
        bullets: [
          t('appMobile:intro.inControl.bullets.0', 'Manual entry'),
          t('appMobile:intro.inControl.bullets.1', 'AI-powered entry'),
          t('appMobile:intro.inControl.bullets.2', 'Export your data'),
        ],
      },
    ],
    [t]
  );

  const [idx, setIdx] = useState(0);
  const current = slides[idx];

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const handleBack = () => {
    if (idx > 0) {
      setIdx((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (idx < slides.length - 1) {
      setIdx((i) => i + 1);
      return;
    }
    // Completed
    try {
      posthog?.capture('onboarding_completed', { durationSec: 0 });
    } catch (error) {
      if (__DEV__) console.error('Failed to capture posthog event:', error);
    }
    router.replace('/auth/login');
    // router.replace('/auth/register');
  };

  React.useEffect(() => {
    try {
      posthog?.capture('onboarding_started', {
        entryPoint: 'signup',
        version: 'v1',
      });
    } catch (error) {
      if (__DEV__) console.error('Failed to capture posthog event:', error);
    }
  }, []);

  return (
    <ScrollableScreen
      className="gap-y-8"
      contentClassName="justify-between p-6"
      edges={['top', 'left', 'right', 'bottom']}
    >
      <VStack className="gap-y-2" align="center">
        <H1 className="text-center text-4xl font-light">{current.title}</H1>
        {current.subtitle ? (
          <P className="text-muted-foreground text-center">
            {current.subtitle}
          </P>
        ) : null}
      </VStack>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <VStack className="gap-y-4">
            {(current.bullets || []).map((b, i) => (
              <HStack key={i} className="items-start gap-3">
                <VStack className="bg-primary h-2 w-2 rounded-full" />
                <Text className="text-lg">{b}</Text>
              </HStack>
            ))}
          </VStack>
        </CardContent>
      </Card>

      <HStack align="center" justify="between">
        <Button variant="ghost" onPress={handleBack} disabled={idx === 0}>
          <Text>{t('landing:intro.back', 'Back')}</Text>
        </Button>

        <HStack className="items-center gap-1">
          {slides.map((_, i) => (
            <VStack
              key={i}
              className={cn(
                'h-2 w-2 rounded-full',
                i === idx ? 'bg-accent' : 'bg-primary'
              )}
            />
          ))}
        </HStack>

        <HStack>
          <LanguageSwitcher compact />
          {idx < slides.length - 1 && (
            <Button variant="ghost" onPress={handleSkip}>
              <Text>{t('appMobile:intro.skip', 'Skip')}</Text>
            </Button>
          )}
          <Button onPress={handleNext}>
            <Text>
              {idx < slides.length - 1
                ? t('appMobile:intro.next', 'Next')
                : t('appMobile:intro.getStarted', 'Get started')}
            </Text>
          </Button>
        </HStack>
      </HStack>
    </ScrollableScreen>
  );
}
