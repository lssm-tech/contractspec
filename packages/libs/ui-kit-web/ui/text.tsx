import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

export type TextProps = React.ComponentPropsWithoutRef<'p'> & {
	asChild?: boolean;
};

function Text({ className, asChild = false, ...props }: TextProps) {
	const Component = asChild ? Slot : 'p';
	return (
		<Component
			className={cn('web:select-text text-base text-foreground', className)}
			{...props}
		/>
	);
}

export { Text };
