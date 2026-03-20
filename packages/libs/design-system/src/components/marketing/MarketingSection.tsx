import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted } from '@contractspec/lib.ui-kit-web/ui/typography';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const sectionVariants = cva('w-full', {
	variants: {
		tone: {
			default: 'bg-background',
			muted: 'border-border/60 border-b bg-muted/40',
			panel:
				'bg-card/60 shadow-[0_10px_60px_-45px_rgba(0,0,0,0.35)] backdrop-blur',
			gradient:
				'bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5',
		},
		padding: {
			compact: 'py-10',
			comfortable: 'py-16 sm:py-20',
			spacious: 'py-20 sm:py-24',
		},
	},
	defaultVariants: {
		tone: 'default',
		padding: 'comfortable',
	},
});

export type MarketingSectionTone = VariantProps<typeof sectionVariants>['tone'];
export type MarketingSectionPadding = VariantProps<
	typeof sectionVariants
>['padding'];

type MarketingSectionProps = React.PropsWithChildren<
	VariantProps<typeof sectionVariants> & {
		eyebrow?: React.ReactNode;
		title?: React.ReactNode;
		subtitle?: React.ReactNode;
		align?: 'left' | 'center';
		maxWidth?: 'lg' | 'xl';
		className?: string;
	}
>;

export function MarketingSection({
	children,
	eyebrow,
	title,
	subtitle,
	align = 'center',
	maxWidth = 'xl',
	tone,
	padding,
	className,
}: MarketingSectionProps) {
	const contentWidth = maxWidth === 'lg' ? 'max-w-5xl' : 'max-w-6xl';
	const headerAlign =
		align === 'center' ? 'items-center text-center' : 'items-start text-left';

	return (
		<section
			className={cn(
				sectionVariants({ tone, padding }),
				'transition-colors',
				className
			)}
		>
			<div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', contentWidth)}>
				{(eyebrow || title || subtitle) && (
					<VStack gap="sm" className={cn('mb-10', headerAlign)}>
						{eyebrow ? (
							<Muted className="font-semibold text-[11px] uppercase tracking-[0.2em]">
								{eyebrow}
							</Muted>
						) : null}
						{title ? (
							<div className="font-bold text-3xl leading-tight md:text-4xl">
								{title}
							</div>
						) : null}
						{subtitle ? (
							<Muted className="text-base md:text-lg">{subtitle}</Muted>
						) : null}
					</VStack>
				)}
				{children}
			</div>
		</section>
	);
}
