import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Link as LinkExpo, type LinkProps } from 'expo-router';
import * as React from 'react';

function Link({
	className,
	...props
}: LinkProps & {
	ref?: React.RefObject<typeof LinkExpo>;
}) {
	return (
		<LinkExpo
			className={cn('className="text-primary underline"', className)}
			{...props}
		/>
	);
}

export { Link };
