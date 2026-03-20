import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export function ConsentItem({
	id,
	label,
	description,
	checked,
	onChange,
	className,
}: {
	id: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
}) {
	return (
		<div className={cn('flex items-start gap-3', className)}>
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={(v: boolean | 'indeterminate') => onChange(Boolean(v))}
			/>
			<div>
				<label htmlFor={id} className="font-medium text-base">
					{label}
				</label>
				{description && (
					<div className="text-base text-muted-foreground">{description}</div>
				)}
			</div>
		</div>
	);
}

export function ConsentList({
	items,
	onChange,
	className,
}: {
	items: {
		id: string;
		label: React.ReactNode;
		description?: React.ReactNode;
		checked: boolean;
	}[];
	onChange: (id: string, checked: boolean) => void;
	className?: string;
}) {
	return (
		<div className={cn('space-y-3', className)}>
			{items.map((it) => (
				<ConsentItem key={it.id} {...it} onChange={(c) => onChange(it.id, c)} />
			))}
		</div>
	);
}
