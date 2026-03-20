import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorId: string | null;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

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
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
		this.setState({ errorId });
		this.props.onError?.(error, errorInfo);
		if (process.env.NODE_ENV === 'development') {
			console.error('ErrorBoundary caught:', error, errorInfo);
		}
	}

	resetError = () => {
		this.setState({ hasError: false, error: null, errorId: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			const isDev = process.env.NODE_ENV === 'development';
			return (
				<View className="flex flex-1 items-center justify-center bg-background p-6">
					<View className="w-full max-w-md items-center">
						<View className="mb-4">
							<AlertTriangle className="h-12 w-12 text-destructive" />
						</View>
						<Text className="mb-2 text-center font-semibold text-foreground text-xl">
							Something went wrong
						</Text>
						<Text className="mb-6 text-center text-muted-foreground">
							We apologize for the inconvenience. Please try again.
						</Text>
						{isDev && (
							<View className="mb-6 w-full rounded-md border border-destructive/20 bg-destructive/10 p-4">
								<Text className="mb-2 font-medium text-destructive">
									Development error:
								</Text>
								<Text className="font-mono text-destructive text-sm">
									{this.state.error.message}
								</Text>
								{this.state.errorId && (
									<Text className="mt-2 text-muted-foreground text-sm">
										ID: {this.state.errorId}
									</Text>
								)}
							</View>
						)}
						<Button
							onPress={this.resetError}
							accessibilityLabel="Try again"
							accessibilityRole="button"
							accessibilityHint="Retry loading the app"
						>
							<Text>Try again</Text>
						</Button>
					</View>
				</View>
			);
		}
		return this.props.children;
	}
}
