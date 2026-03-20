import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const Textarea = React.forwardRef<
	TextInput,
	TextInputProps & {
		ref?: React.RefObject<TextInput>;
	}
>(({ className, placeholderClassName, ...props }, ref) => {
	return (
		<TextInput
			ref={ref}
			className={cn(
				'web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 native:text-lg text-base text-foreground native:leading-tight web:ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:focus-visible:outline-hidden web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm',
				props.editable === false && 'web:cursor-not-allowed opacity-50',
				className
			)}
			placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
			multiline
			{...props}
		/>
	);
});

Textarea.displayName = 'Textarea';

export { Textarea };
