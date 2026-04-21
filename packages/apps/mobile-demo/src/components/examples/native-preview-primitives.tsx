import { Text } from '@contractspec/lib.ui-kit/ui/text';
import type { ReactNode } from 'react';
import { View } from 'react-native';

export function Panel({ children }: { children: ReactNode }) {
	return (
		<View className="gap-5 rounded-lg border border-input bg-card p-4">
			{children}
		</View>
	);
}

export function PanelHeader({
	description,
	eyebrow,
	title,
}: {
	description?: string;
	eyebrow: string;
	title: string;
}) {
	return (
		<View className="gap-2">
			<Text className="font-semibold text-muted-foreground text-xs uppercase">
				{eyebrow}
			</Text>
			<Text className="font-semibold text-2xl text-foreground">{title}</Text>
			{description ? (
				<Text className="text-muted-foreground text-sm leading-6">
					{description}
				</Text>
			) : null}
		</View>
	);
}

export function MetricRow({ items }: { items: readonly [string, string][] }) {
	return (
		<View className="flex-row flex-wrap gap-2">
			{items.map(([label, value]) => (
				<View
					key={label}
					className="min-w-24 flex-1 rounded-lg border border-input bg-background p-3"
				>
					<Text className="font-bold text-2xl text-foreground">{value}</Text>
					<Text className="text-muted-foreground text-xs">{label}</Text>
				</View>
			))}
		</View>
	);
}

export function MetaGrid({ items }: { items: readonly [string, string][] }) {
	return (
		<View className="gap-2">
			{items.map(([label, value]) => (
				<View key={label} className="gap-1">
					<Text className="font-semibold text-foreground text-sm">{label}</Text>
					<Text className="text-muted-foreground text-sm">{value}</Text>
				</View>
			))}
		</View>
	);
}

export function PreviewList({
	eyebrow,
	items,
}: {
	eyebrow?: string;
	items: readonly { body?: string; subtitle?: string; title: string }[];
}) {
	return (
		<View className="gap-3">
			{eyebrow ? (
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					{eyebrow}
				</Text>
			) : null}
			{items.map((item) => (
				<View
					key={`${item.title}-${item.subtitle ?? ''}`}
					className="gap-1 rounded-lg border border-input bg-background p-3"
				>
					<Text className="font-semibold text-base text-foreground">
						{item.title}
					</Text>
					{item.subtitle ? (
						<Text className="text-muted-foreground text-xs">
							{item.subtitle}
						</Text>
					) : null}
					{item.body ? (
						<Text className="text-muted-foreground text-sm leading-5">
							{item.body}
						</Text>
					) : null}
				</View>
			))}
		</View>
	);
}

export function TagList({ tags }: { tags: readonly string[] }) {
	if (tags.length === 0) {
		return null;
	}

	return (
		<View className="flex-row flex-wrap gap-2">
			{tags.slice(0, 8).map((tag) => (
				<Text
					key={tag}
					className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs"
				>
					{tag}
				</Text>
			))}
		</View>
	);
}
