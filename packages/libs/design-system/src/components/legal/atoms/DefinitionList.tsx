import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export function DefinitionList({
	items,
	className,
}: {
	items: { term: React.ReactNode; description: React.ReactNode }[];
	className?: string;
}) {
	return (
		<dl className={cn('grid grid-cols-1 gap-3 md:grid-cols-3', className)}>
			{items.map((it, idx) => (
				<div
					key={idx}
					className="col-span-1 grid grid-cols-3 gap-3 md:col-span-3"
				>
					<dt className="col-span-1 font-medium text-base text-foreground">
						{it.term}
					</dt>
					<dd className="col-span-2 text-base text-muted-foreground">
						{it.description}
					</dd>
				</div>
			))}
		</dl>
	);
}
