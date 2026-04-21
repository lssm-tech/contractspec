import { Input } from '@contractspec/lib.ui-kit/ui/input';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { Pressable, View } from 'react-native';

export type ExamplePreviewFilter = 'all' | 'generic' | 'rich' | 'web-ui';

export interface ExamplePreviewStats {
	generic: number;
	rich: number;
	total: number;
	webUi: number;
}

const FILTERS: readonly {
	label: string;
	value: ExamplePreviewFilter;
}[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Rich native', value: 'rich' },
	{ label: 'Web UI export', value: 'web-ui' },
	{ label: 'Generic', value: 'generic' },
];

export function ExamplePreviewControls({
	filter,
	onFilterChange,
	onSearchChange,
	search,
	stats,
}: {
	filter: ExamplePreviewFilter;
	onFilterChange: (filter: ExamplePreviewFilter) => void;
	onSearchChange: (search: string) => void;
	search: string;
	stats: ExamplePreviewStats;
}) {
	return (
		<View className="gap-4">
			<View className="flex-row flex-wrap gap-2">
				<StatPill label="Examples" value={stats.total} />
				<StatPill label="Rich native" value={stats.rich} />
				<StatPill label="Web UI" value={stats.webUi} />
				<StatPill label="Generic" value={stats.generic} />
			</View>

			<Input
				accessibilityLabel="Search examples"
				placeholder="Search examples"
				value={search}
				onChangeText={onSearchChange}
			/>

			<View className="flex-row flex-wrap gap-2">
				{FILTERS.map((item) => {
					const active = item.value === filter;
					return (
						<Pressable
							key={item.value}
							className={`min-h-10 justify-center rounded-full border px-3 ${
								active
									? 'border-primary bg-primary'
									: 'border-input bg-background'
							}`}
							accessibilityRole="button"
							accessibilityLabel={`Show ${item.label} examples`}
							onPress={() => onFilterChange(item.value)}
						>
							<Text
								className={`font-semibold text-sm ${
									active ? 'text-primary-foreground' : 'text-foreground'
								}`}
							>
								{item.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

function StatPill({ label, value }: { label: string; value: number }) {
	return (
		<View className="min-w-24 flex-1 rounded-lg border border-input bg-card p-3">
			<Text className="font-bold text-2xl text-foreground">{value}</Text>
			<Text className="text-muted-foreground text-xs">{label}</Text>
		</View>
	);
}
