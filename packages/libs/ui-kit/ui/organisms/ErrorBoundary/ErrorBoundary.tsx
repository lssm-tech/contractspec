'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  errorId: string | null;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  resetError,
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Une erreur s'est produite
        </h1>

        <p className="mb-6 text-gray-600">
          Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et
          travaille à résoudre le problème.
        </p>

        {isDevelopment && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-left">
            <p className="mb-2 text-base font-medium text-red-800">
              Erreur de développement:
            </p>
            <p className="font-mono text-sm break-all text-red-700">
              {error.message}
            </p>
            {errorId && (
              <p className="mt-2 text-sm text-red-600">ID: {errorId}</p>
            )}
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onPress={resetError} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>

          <Button
            onPress={() => (window.location.href = '/')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Button>
        </div>

        {!isDevelopment && errorId && (
          <p className="mt-4 text-sm text-gray-500">Code d'erreur: {errorId}</p>
        )}
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', { ...errorInfo });
      scope.setContext('errorId', { errorId });
      Sentry.captureException(error);
    });

    // Update state with error ID
    this.setState({ errorId });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  return React.useCallback((error: Error) => {
    // This will be caught by the nearest error boundary
    throw error;
  }, []);
};

export type { ErrorBoundaryProps, ErrorFallbackProps };
