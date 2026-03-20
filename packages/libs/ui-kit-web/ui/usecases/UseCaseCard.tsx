import { Button } from '../button';
import { HStack, VStack } from '../stack';

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
			<div className="font-semibold text-lg">{title}</div>
			{summary && (
				<div className="text-base text-muted-foreground">{summary}</div>
			)}
			{ctaHref && (
				<HStack>
					<a href={ctaHref} onClick={onCtaClick}>
						<Button size="sm" variant="outline">
							{ctaLabel}
						</Button>
					</a>
				</HStack>
			)}
		</VStack>
	);
}
