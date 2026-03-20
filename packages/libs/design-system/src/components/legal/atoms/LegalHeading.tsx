import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const headingVariants = cva('text-foreground tracking-tight', {
	variants: {
		level: {
			h1: 'font-semibold text-3xl md:text-4xl',
			h2: 'font-semibold text-2xl md:text-3xl',
			h3: 'font-semibold text-xl md:text-2xl',
			h4: 'font-semibold text-lg md:text-xl',
		},
		tone: {
			default: '',
			muted: 'text-muted-foreground',
			accent: 'text-primary',
		},
		spacing: {
			none: '',
			sm: 'mt-4',
			md: 'mt-6',
			lg: 'mt-8',
		},
	},
	defaultVariants: {
		level: 'h2',
		tone: 'default',
		spacing: 'md',
	},
});

export type LegalHeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
	VariantProps<typeof headingVariants> & {
		as?: 'h1' | 'h2' | 'h3' | 'h4';
	};

export function LegalHeading({
	as,
	level,
	tone,
	spacing,
	className,
	...props
}: LegalHeadingProps) {
	const Comp = (as ?? level ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4';
	return (
		<Comp
			className={cn(headingVariants({ level, tone, spacing }), className)}
			{...props}
		/>
	);
}

export { headingVariants };
