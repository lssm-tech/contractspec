/**
 * ErrorBoundary
 *
 * Catches render-time errors and displays a friendly UI using UI-kit.
 * Next.js compatibility: Pure client component; no SSR-side effects.
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@contractspec/lib.ui-kit/ui/card';
import { H2, H3, P } from '@contractspec/lib.ui-kit/ui/typography';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Track error with analytics
    // Analytics.error(error, 'error_boundary');

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Analytics.buttonPress('error_retry', 'error_boundary');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <VStack className="flex-1 justify-center p-4">
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <VStack spacing="sm" align="center">
                <AlertTriangle className="text-destructive h-12 w-12" />
                <H2 className="text-destructive text-center">
                  Something went wrong
                </H2>
              </VStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="lg" align="center">
                <P className="text-muted-foreground text-center">
                  We encountered an unexpected error. Don't worry, we've been
                  notified and will look into it.
                </P>

                {__DEV__ && this.state.error && (
                  <Card className="bg-muted w-full">
                    <CardContent className="p-3">
                      <VStack spacing="xs">
                        <H3 className="font-mono text-base">
                          {this.state.error.name}
                        </H3>
                        <P className="text-muted-foreground font-mono text-sm">
                          {this.state.error.message}
                        </P>
                        {this.state.error.stack && (
                          <P className="text-muted-foreground font-mono text-sm">
                            {this.state.error.stack
                              .split('\n')
                              .slice(0, 5)
                              .join('\n')}
                          </P>
                        )}
                      </VStack>
                    </CardContent>
                  </Card>
                )}

                <Button onPress={this.handleRetry} className="w-full">
                  <VStack className="flex-row items-center gap-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <P>Try Again</P>
                  </VStack>
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </VStack>
      );
    }

    return this.props.children;
  }
}
