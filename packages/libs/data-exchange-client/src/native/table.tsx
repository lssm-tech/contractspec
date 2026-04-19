import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

function getColumnKeys(rows: Record<string, unknown>[]) {
	return Array.from(
		new Set(
			rows.flatMap((row) => Object.keys(row).filter((key) => key !== 'id'))
		)
	);
}

export function NativePreviewTable({
	title,
	rows,
}: {
	title: string;
	rows: Record<string, unknown>[];
}) {
	const columns = React.useMemo(() => getColumnKeys(rows), [rows]);

	return (
		<View>
			<Text>{title}</Text>
			<ScrollView horizontal>
				<View>
					{rows.map((row, rowIndex) => (
						<View key={String(row.id ?? rowIndex)}>
							{columns.map((column) => (
								<Text key={`${rowIndex}-${column}`}>
									{column}: {String(row[column] ?? '')}
								</Text>
							))}
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
