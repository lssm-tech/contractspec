import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export function KeyValueList({
	items,
	className,
}: {
	items: { key: React.ReactNode; value: React.ReactNode }[];
	className?: string;
}) {
	return (
		<div className={cn('grid grid-cols-1 gap-2', className)}>
			{items.map((it, idx) => (
				<div key={idx} className="flex items-start gap-3">
					<div className="w-40 shrink-0 font-medium text-base text-foreground">
						{it.key}
					</div>
					<div className="flex-1 text-base text-muted-foreground">
						{it.value}
					</div>
				</div>
			))}
		</div>
	);
}
