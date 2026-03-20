import { Link } from 'expo-router';
import { Button } from '../button';
import { HStack, VStack } from '../stack';
import { Text } from '../text';

export function UseCaseCard({
	title,
	summary,
	ctaHref,
	ctaLabel = 'Learn more',
	onCtaClick,
}: {
	title: string;
	summary?: string;
	ctaHref?: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
}) {
	return (
		<VStack className="rounded-lg border p-4" gap="sm">
			<Text className="font-semibold text-lg">{title}</Text>
			{summary && (
				<Text className="text-base text-muted-foreground">{summary}</Text>
			)}
			{ctaHref && (
				<HStack>
					<Link href={ctaHref}>
						<Button size="sm" variant="outline" onPress={onCtaClick}>
							{ctaLabel}
						</Button>
					</Link>
				</HStack>
			)}
		</VStack>
	);
}
