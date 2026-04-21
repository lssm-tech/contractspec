import './global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ErrorBoundary>
				<StatusBar style="auto" />
				<Stack>
					<Stack.Screen name="index" options={{ title: 'ContractSpec' }} />
					<Stack.Screen name="product" options={{ title: 'Product' }} />
					<Stack.Screen name="templates" options={{ title: 'Templates' }} />
					<Stack.Screen name="pricing" options={{ title: 'Pricing' }} />
					<Stack.Screen name="docs" options={{ title: 'Docs' }} />
					<Stack.Screen name="changelog" options={{ title: 'Changelog' }} />
				</Stack>
			</ErrorBoundary>
		</GestureHandlerRootView>
	);
}
