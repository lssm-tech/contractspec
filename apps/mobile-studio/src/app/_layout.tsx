/**
 * Root Layout
 * - Client-run navigation stack with providers; UI-kit only
 * - For Next.js readiness: treat as client component and gate platform-specific APIs
 */
import '../global.css';

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '@contractspec/lib.ui-kit/ui/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostHogProvider } from 'posthog-react-native';
import {
  posthog,
  posthogKey,
} from '@contractspec/bundle.studio/presentation/libs/posthog/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProviderNative } from '@contractspec/lib.translation-studio/native';
import { AppProvider } from '~/components/providers/AppProvider';
import { A11YProvider } from '~/components/providers/A11YProvider';
import { Toaster } from 'burnt/web';
// Icons for FAB removed due to Relay removal and type issues
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Sentry is optional; keep import guarded by bundler if available
// import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

// SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const queryClient = new QueryClient();
console.log('root env keys', process.env.EXPO_PUBLIC_ARTISAN_POSTHOG_KEY);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Conditional PostHog wrapper to avoid SSR issues on web
function ConditionalPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = React.useState(false);

  console.log('env keys', process.env.EXPO_PUBLIC_ARTISAN_POSTHOG_KEY);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      setIsClient(true);
    }
  }, []);

  // For native platforms, always render PostHog
  if (Platform.OS !== 'web') {
    if (__DEV__) console.log('Rendering PostHogProvider on native');
    return (
      <PostHogProvider
        apiKey={posthogKey}
        // options={BASE_POSTHOG_OPTIONS}
        client={posthog}
      >
        {children}
      </PostHogProvider>
    );
  }

  // For web, only render PostHog after client-side hydration
  // if (!isClient) {
  //   console.log("Skipping PostHogProvider on web", { isClient });
  //   return <>{children}</>;
  // }

  if (__DEV__) console.log('Rendering PostHogProvider on web', { isClient });
  return (
    <PostHogProvider
      apiKey={posthogKey}
      // options={BASE_POSTHOG_OPTIONS}
      client={posthog}
    >
      {children}
    </PostHogProvider>
  );
}

// Relay removed: using shared React Query GraphQL hooks instead

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      setAndroidNavigationBar(isDarkColorScheme ? 'dark' : 'light');
    }
  }, [isDarkColorScheme]);

  // FAB actions removed; reintroduce later with proper icon types if needed

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      SplashScreen.hide();
    }
  }, []);
  // }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConditionalPostHogProvider>
      <I18nProviderNative>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <GestureHandlerRootView>
                <SafeAreaProvider>
                  <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                  <A11YProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen
                        name="auth"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="farewell" />
                      <Stack.Screen name="onboarding" />
                      <Stack.Screen name="events/[id]" />
                      <Stack.Screen name="messages/new" />
                    </Stack>

                    {/* Global FAB */}
                    {/* <FAB*/}
                    {/*  actions={fabActions}*/}
                    {/*  mainIcon={<Key size={24} color="white" />}*/}
                    {/*  mainColor="bg-blue-600"*/}
                    {/*/> */}

                    <Toaster position="bottom-right" />
                    <PortalHost />
                  </A11YProvider>
                </SafeAreaProvider>
              </GestureHandlerRootView>
            </ThemeProvider>
          </AppProvider>
        </QueryClientProvider>
      </I18nProviderNative>
    </ConditionalPostHogProvider>
  );
}
// const useIsomorphicLayoutEffect =
//   Platform.OS === 'web' && typeof window === 'undefined'
//     ? React.useEffect
//     : React.useLayoutEffect;
//
// function useSetWebBackgroundClassName() {
//   useIsomorphicLayoutEffect(() => {
//     // Adds the background color to the html element to prevent white background on overscroll.
//     document.documentElement.classList.add('bg-background');
//   }, []);
// }
//
// function useSetAndroidNavigationBar() {
//   React.useLayoutEffect(() => {
//     setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
//   }, []);
// }
//
// function noop() {}
