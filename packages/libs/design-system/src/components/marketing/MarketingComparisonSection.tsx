import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import { CheckCircle } from 'lucide-react';
import * as React from 'react';
import {
	MarketingSection,
	type MarketingSectionPadding,
	type MarketingSectionTone,
} from './MarketingSection';

interface ComparisonColumn {
	title: string;
	items: (string | React.ReactNode)[];
}

export interface MarketingComparisonSectionProps {
	eyebrow?: React.ReactNode;
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	left: ComparisonColumn;
	right: ComparisonColumn;
	tone?: MarketingSectionTone;
	padding?: MarketingSectionPadding;
}

export function MarketingComparisonSection({
	eyebrow,
	title,
	subtitle,
	left,
	right,
	tone = 'default',
	padding = 'comfortable',
}: MarketingComparisonSectionProps) {
	const columns = [left, right];

	return (
		<MarketingSection
			tone={tone}
			padding={padding}
			eyebrow={eyebrow}
			title={title}
			subtitle={subtitle}
			align="center"
		>
			<div className="grid gap-8 md:grid-cols-2">
				{columns.map((col) => (
					<VStack
						key={col.title}
						gap="md"
						align="start"
						className="rounded-xl border border-border/50 bg-card/50 p-6"
					>
						<Small className="font-semibold text-sm">{col.title}</Small>
						<VStack
							as="div"
							role="list"
							gap="sm"
							align="start"
							className="list-none p-0"
						>
							{col.items.map((item, idx) => (
								<HStack
									as="div"
									role="listitem"
									key={idx}
									gap="sm"
									align="start"
								>
									<CheckCircle className="mt-0.5 text-violet-400" size={18} />
									<Muted className="text-sm leading-relaxed">{item}</Muted>
								</HStack>
							))}
						</VStack>
					</VStack>
				))}
			</div>
		</MarketingSection>
	);
}
