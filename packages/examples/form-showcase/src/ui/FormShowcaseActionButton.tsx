'use client';

import { Button } from '@contractspec/lib.design-system';
import { Text } from '@contractspec/lib.design-system/typography';

export function ActionButton({
	label,
	variant = 'ghost',
}: {
	label: string;
	variant?: 'ghost' | 'primary';
}) {
	return (
		<Button
			type="button"
			className={variant === 'primary' ? 'btn-primary' : 'btn-ghost'}
		>
			<Text>{label}</Text>
		</Button>
	);
}
