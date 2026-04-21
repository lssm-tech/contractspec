import type {
	LandingNavigationItem,
	LandingPageKey,
} from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { type Href, Link } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export function LandingScreenShell(props: {
	currentPageKey: LandingPageKey;
	navigation: LandingNavigationItem[];
	onOpenExternalNav: (item: LandingNavigationItem) => void;
	children: ReactNode;
}) {
	return (
		<View className="flex-1 bg-background">
			<View className="border-input border-b bg-background px-5 pt-5 pb-3">
				<View className="mb-4">
					<Text className="font-semibold text-foreground text-lg">
						ContractSpec
					</Text>
					<Text className="text-muted-foreground text-xs">
						Open spec system
					</Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View className="flex-row gap-2">
						{props.navigation.map((item) => {
							const active = item.pageKey === props.currentPageKey;
							const className = `min-h-10 justify-center rounded-full border px-4 ${
								active
									? 'border-primary bg-primary'
									: 'border-input bg-background'
							}`;
							const labelClassName = `font-semibold text-sm ${
								active ? 'text-primary-foreground' : 'text-foreground'
							}`;

							if (item.kind === 'native') {
								return (
									<Link key={item.id} href={item.href as Href} asChild>
										<Pressable className={className}>
											<Text className={labelClassName}>{item.label}</Text>
										</Pressable>
									</Link>
								);
							}

							return (
								<Pressable
									key={item.id}
									className={className}
									onPress={() => props.onOpenExternalNav(item)}
									accessibilityRole="link"
									accessibilityLabel={item.label}
								>
									<Text className={labelClassName}>{item.label}</Text>
								</Pressable>
							);
						})}
					</View>
				</ScrollView>
			</View>
			{props.children}
		</View>
	);
}
