'use client';

import * as React from 'react';

export interface UseMessageSelectionReturn {
	selectedIds: Set<string>;
	toggle: (id: string) => void;
	selectAll: () => void;
	clearSelection: () => void;
	isSelected: (id: string) => boolean;
	selectedCount: number;
}

/**
 * Hook for managing message selection state.
 * Selection persists when messages change; ids of non-existent messages are removed.
 */
export function useMessageSelection(
	messageIds: string[]
): UseMessageSelectionReturn {
	const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
		() => new Set()
	);

	const idSet = React.useMemo(
		() => new Set(messageIds),
		[messageIds.join(',')]
	);

	React.useEffect(() => {
		setSelectedIds((prev) => {
			const next = new Set<string>();
			for (const id of prev) {
				if (idSet.has(id)) next.add(id);
			}
			return next.size === prev.size ? prev : next;
		});
	}, [idSet]);

	const toggle = React.useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const selectAll = React.useCallback(() => {
		setSelectedIds(new Set(messageIds));
	}, [messageIds.join(',')]);

	const clearSelection = React.useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const isSelected = React.useCallback(
		(id: string) => selectedIds.has(id),
		[selectedIds]
	);

	const selectedCount = selectedIds.size;

	return {
		selectedIds,
		toggle,
		selectAll,
		clearSelection,
		isSelected,
		selectedCount,
	};
}
