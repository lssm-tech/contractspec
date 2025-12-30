/**
 * AppProvider
 *
 * Wraps the application with providers for i18n, auth, and error boundaries.
 * Next.js compatibility: Effects run only on the client; no SSR-unsafe work is
 * performed at module scope.
 */
import React, { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { ErrorBoundary } from '../error-boundary';
import { StatusBar } from 'expo-status-bar';
import { I18nProviderNative } from '@contractspec/lib.translation-studio/native';
import { AuthProvider } from '@contractspec/bundle.studio/presentation/providers/auth/context';

// import { AuthProvider } from '../modules/auth';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    // Track app initialization
    // Analytics.screenView('app_init');

    // Monitor app state changes for analytics
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Analytics.screenView('app_foreground');
      } else if (nextAppState === 'background') {
        // Analytics.screenView('app_background');
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Performance monitoring setup
    if (__DEV__) {
      console.log('App initialized in development mode');
      console.log('Platform:', Platform.OS);
      console.log('Platform Version:', Platform.Version);
    }

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleGlobalError = (error: Error, _errorInfo: React.ErrorInfo) => {
    // Global error handling logic
    console.error('Global error caught:', error);

    // You might want to send to crash reporting service here
    // Crashlytics.recordError(error);
  };

  return (
    <I18nProviderNative>
      <ErrorBoundary onError={handleGlobalError}>
        <StatusBar style="auto" />
        <AuthProvider>
          <ErrorBoundary onError={handleGlobalError}>{children}</ErrorBoundary>
        </AuthProvider>
      </ErrorBoundary>
    </I18nProviderNative>
  );
}
