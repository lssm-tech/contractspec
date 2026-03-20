import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
	return (
		<ErrorBoundary>
			<StatusBar style="auto" />
			<Stack>
				<Stack.Screen name="index" options={{ title: 'Tasks' }} />
				<Stack.Screen name="add" options={{ title: 'Add Task' }} />
			</Stack>
		</ErrorBoundary>
	);
}
