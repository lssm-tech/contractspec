import { cn } from '@contractspec/lib.ui-kit-core';
import * as React from 'react';

function Link({
	className,
	...props
}: React.HTMLProps<HTMLAnchorElement> & {
	href: string;
}) {
	return <a className={cn('', className)} {...props} />;
}

export default Link;
