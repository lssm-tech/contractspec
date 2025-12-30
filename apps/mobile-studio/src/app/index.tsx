/**
 * Screen: Welcome / Root
 * - Redirects based on auth; UI-kit only
 * - Client-only; add guards if ported to Next.js
 */
import { useEffect } from 'react';
import { Link, router } from 'expo-router';
import { authClient } from '@contractspec/bundle.studio/presentation/providers/auth/index.native';
import { useAuthContext } from '@contractspec/bundle.studio/presentation/providers/auth/context';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { H1, P } from '@contractspec/lib.ui-kit/ui/typography';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { Button } from '@contractspec/lib.design-system';
import { LoadingButton } from '@contractspec/lib.ui-kit/ui/loading-button';
import { useT } from '@contractspec/lib.translation-studio';

export default function WelcomeScreen() {
  const { t } = useT(['roommate']);
  const { isLoading, isAuthenticated, user } = useAuthContext();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    console.log('Welcome screen', isLoading, isAuthenticated, user, {
      data,
      isPending,
    });
    if (isAuthenticated) {
      // Redirect to tabs - the tabs layout will handle onboarding redirect
      // router.replace('/clients');
      console.log('redirect to logged home');
    }
  }, [isAuthenticated, isLoading, data, isPending]);

  if (!isAuthenticated) {
    return (
      <VStack className="flex-1 justify-center p-6">
        <VStack className="gap-y-8">
          <VStack className="gap-y-4 text-center">
            <H1 className="text-center text-5xl font-light">
              {t('appMobile:home.welcome', 'Welcome to ArtisanOS')}
            </H1>
            <P className="text-muted-foreground text-center text-xl">
              {t('appMobile:home.tagline', 'Your all-in-one tool for craftman')}
            </P>
          </VStack>

          <VStack className="gap-y-4">
            <Link href={'/intro'} asChild>
              <LoadingButton variant="ghost" className="w-full">
                <Text>{t('appMobile:home.learnMore', 'Learn more')}</Text>
              </LoadingButton>
            </Link>
            <Button
              onClick={() => {
                console.log('Sign in button prepressed');
                router.push('/auth/login');
                console.log('Sign in button pressed');
              }}
              className="w-full"
            >
              <Text>{t('appMobile:home.signIn', 'Sign in')}</Text>
            </Button>

            <Button
              variant="outline"
              // onPress={() => router.push('/auth/register')}
              className="w-full"
            >
              <Text>{t('appMobile:home.createAccount', 'Create account')}</Text>
            </Button>
          </VStack>
        </VStack>
      </VStack>
    );
  }

  return null;
}
