import { HStack, VStack } from '@contractspec/lib.ui-kit/ui/stack';
import * as React from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import type { FiltersToolbarProps } from './FiltersToolbar';

export function FiltersToolbar({
	className,
	children,
	right,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	onSearchSubmit,
	debounceMs = 250,
	activeChips = [],
	onClearAll,
}: FiltersToolbarProps) {
	const [q, setQ] = React.useState<string>(searchValue ?? '');

	React.useEffect(() => {
		setQ(searchValue ?? '');
	}, [searchValue]);

	React.useEffect(() => {
		if (!onSearchChange) return;
		const id = setTimeout(() => onSearchChange(q), debounceMs);
		return () => clearTimeout(id);
	}, [q, debounceMs, onSearchChange]);

	return (
		<VStack className={className}>
			<HStack className="items-center gap-2">
				{onSearchChange ? (
					<HStack className="flex-1 items-center gap-2">
						<Input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder={searchPlaceholder}
							keyboard={{ kind: 'search' }}
						/>
						<Button variant="outline" onPress={() => onSearchSubmit?.()}>
							Rechercher
						</Button>
					</HStack>
				) : null}
				{children}
				{right}
			</HStack>
			{(activeChips.length > 0 || onClearAll) && (
				<HStack className="mt-2 flex flex-wrap items-center gap-2">
					{activeChips.map((chip) => (
						<Button
							key={chip.key}
							size="sm"
							variant="secondary"
							disabled={chip.disabled}
							onPress={chip.disabled ? undefined : chip.onRemove}
						>
							{chip.label}
						</Button>
					))}
					{onClearAll ? (
						<Button size="sm" variant="ghost" onPress={onClearAll}>
							Effacer les filtres
						</Button>
					) : null}
				</HStack>
			)}
		</VStack>
	);
}
