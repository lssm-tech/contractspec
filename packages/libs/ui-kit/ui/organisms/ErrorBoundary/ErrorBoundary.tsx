'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import React from 'react';
import { Platform, View } from 'react-native';
import { Button } from '../../button';
import { Text } from '../../text';
import { P } from '../../typography';

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

	const goHome = () => {
		if (Platform.OS === 'web' && typeof window !== 'undefined') {
			window.location.href = '/';
		}
	};

	return (
		<View className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<View className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<View className="mb-4 flex justify-center">
					<AlertTriangle className="h-12 w-12 text-red-500" />
				</View>

				<Text className="mb-2 font-semibold text-2xl text-gray-900">
					Une erreur s'est produite
				</Text>

				<P className="mb-6 text-gray-600">
					Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et
					travaille à résoudre le problème.
				</P>

				{isDevelopment && (
					<View className="mb-6 rounded-md bg-red-50 p-4">
						<P className="mb-2 font-medium text-base text-red-800">
							Erreur de développement:
						</P>
						<Text className="break-all font-mono text-red-700 text-sm">
							{error.message}
						</Text>
						{errorId && (
							<P className="mt-2 text-red-600 text-sm">ID: {errorId}</P>
						)}
					</View>
				)}

				<View className="flex flex-col justify-center gap-3 sm:flex-row">
					<Button onPress={resetError} className="flex items-center gap-2">
						<RefreshCw className="h-4 w-4" />
						Réessayer
					</Button>

					<Button
						onPress={goHome}
						variant="secondary"
						className="flex items-center gap-2"
					>
						<Home className="h-4 w-4" />
						Accueil
					</Button>
				</View>

				{!isDevelopment && errorId && (
					<P className="mt-4 text-gray-500 text-sm">Code d'erreur: {errorId}</P>
				)}
			</View>
		</View>
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
		const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

		// Log to Sentry with additional context
		// Sentry.withScope((scope) => {
		//   scope.setTag('errorBoundary', true);
		//   scope.setContext('errorInfo', { ...errorInfo });
		//   scope.setContext('errorId', { errorId });
		//   Sentry.captureException(error);
		// });

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
