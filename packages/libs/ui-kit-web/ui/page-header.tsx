import type { SharedPageHeaderProps } from '@contractspec/lib.ui-kit-core/interfaces';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HStack, VStack } from './stack';

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
			<HStack className="flex-col items-start justify-between md:flex-row">
				<VStack className="gap-1">
					<h1 className="font-semibold text-2xl md:text-3xl">{title}</h1>
					{subtitle ? (
						<p className="text-base text-muted-foreground">{subtitle}</p>
					) : null}
				</VStack>
				{actions ? (
					<div className="flex items-center gap-2">{actions}</div>
				) : null}
			</HStack>
		</VStack>
	);
}
