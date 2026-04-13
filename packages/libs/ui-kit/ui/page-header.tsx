import type { SharedPageHeaderProps } from '@contractspec/lib.ui-kit-core/interfaces';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HStack, VStack } from './stack';
import { H1, P } from './typography';

const headerVariants = cva('', {
	variants: {
		spacing: {
			sm: 'gap-1',
			md: 'gap-2',
			lg: 'gap-3',
		},
	},
	defaultVariants: {
		spacing: 'md',
	},
});

export interface PageHeaderProps
	extends SharedPageHeaderProps,
		VariantProps<typeof headerVariants> {}

export function PageHeader({
	breadcrumb,
	title,
	subtitle,
	actions,
	spacing,
	className,
}: PageHeaderProps) {
	return (
		<VStack className={cn(headerVariants({ spacing }), className)}>
			{breadcrumb}
			<HStack className="items-start justify-between">
				<VStack className="gap-1">
					<H1 className="font-semibold text-2xl md:text-3xl">{title}</H1>
					{subtitle ? (
						<P className="text-base text-muted-foreground">{subtitle}</P>
					) : null}
				</VStack>
				{actions ? (
					<HStack className="flex items-center gap-2">{actions}</HStack>
				) : null}
			</HStack>
		</VStack>
	);
}
