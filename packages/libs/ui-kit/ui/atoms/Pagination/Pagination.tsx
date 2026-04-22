import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react-native';
import React from 'react';
import { Button } from '../../button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../select';
import { HStack, VStack } from '../../stack';
import { Text } from '../../text';
import type { PaginationProps } from './types';

type VisiblePageItem = number | 'start-ellipsis' | 'end-ellipsis';

function getVisiblePageItems(
	currentPage: number,
	totalPages: number
): VisiblePageItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages];
	}

	if (currentPage >= totalPages - 2) {
		return [
			1,
			'start-ellipsis',
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		];
	}

	return [
		1,
		'start-ellipsis',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'end-ellipsis',
		totalPages,
	];
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	disabled = false,
	className = '',
	showItemsPerPage = true,
	itemsPerPageOptions = [10, 25, 50, 100],
}) => {
	if (totalPages <= 0) return null;

	const safeTotalItems = Math.max(0, totalItems);
	const safeItemsPerPage = Math.max(1, itemsPerPage);
	const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
	const startItem =
		safeTotalItems === 0
			? 0
			: (normalizedCurrentPage - 1) * safeItemsPerPage + 1;
	const endItem =
		safeTotalItems === 0
			? 0
			: Math.min(normalizedCurrentPage * safeItemsPerPage, safeTotalItems);

	const canGoPrevious = normalizedCurrentPage > 1 && !disabled;
	const canGoNext = normalizedCurrentPage < totalPages && !disabled;
	const visiblePageItems = getVisiblePageItems(
		normalizedCurrentPage,
		totalPages
	);

	return (
		<VStack
			align="center"
			gap="md"
			justify="between"
			className={`sm:flex-row ${className}`}
		>
			{/* Items info */}
			<VStack className="order-2 text-base text-muted-foreground sm:order-1">
				<Text>
					Affichage de {startItem} à {endItem} sur {safeTotalItems} résultats
				</Text>
			</VStack>

			{/* Pagination controls */}
			<HStack align="center" gap="sm" className="order-1 sm:order-2">
				{/* First page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(1)}
					disabled={!canGoPrevious}
					accessibilityLabel="Première page"
					className="hidden h-8 w-8 p-0 sm:flex"
				>
					<ChevronsLeft className="h-4 w-4" />
					<Text className="sr-only">Première page</Text>
				</Button>

				{/* Previous page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(normalizedCurrentPage - 1)}
					disabled={!canGoPrevious}
					accessibilityLabel="Page précédente"
					className="h-8 w-8 p-0"
				>
					<ChevronLeft className="h-4 w-4" />
					<Text className="sr-only">Page précédente</Text>
				</Button>

				{/* Page numbers */}
				<HStack align="center" gap="xs">
					{visiblePageItems.map((pageItem) => {
						if (typeof pageItem !== 'number') {
							return (
								<HStack
									key={pageItem}
									className="px-2 py-1 text-muted-foreground"
								>
									<Text>...</Text>
								</HStack>
							);
						}

						return (
							<Button
								key={pageItem}
								variant={
									pageItem === normalizedCurrentPage ? 'default' : 'outline'
								}
								size="sm"
								onPress={() => onPageChange(pageItem)}
								disabled={disabled}
								accessibilityLabel={`Page ${pageItem}`}
								className="h-8 min-w-8 px-2"
							>
								<Text>{pageItem}</Text>
							</Button>
						);
					})}
				</HStack>

				{/* Next page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(normalizedCurrentPage + 1)}
					disabled={!canGoNext}
					accessibilityLabel="Page suivante"
					className="h-8 w-8 p-0"
				>
					<ChevronRight className="h-4 w-4" />
					<Text className="sr-only">Page suivante</Text>
				</Button>

				{/* Last page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(totalPages)}
					disabled={!canGoNext}
					accessibilityLabel="Dernière page"
					className="hidden h-8 w-8 p-0 sm:flex"
				>
					<ChevronsRight className="h-4 w-4" />
					<Text className="sr-only">Dernière page</Text>
				</Button>
			</HStack>

			{/* Items per page */}
			{showItemsPerPage && onItemsPerPageChange && (
				<HStack align="center" gap="sm" className="order-3 text-base">
					<Text className="text-muted-foreground">Afficher:</Text>
					<Select
						value={{
							value: itemsPerPage.toString(),
							label: itemsPerPage.toString(),
						}}
						onValueChange={(value) => {
							const parsed = parseInt(value?.value ?? '', 10);
							if (!Number.isNaN(parsed) && parsed > 0) {
								onItemsPerPageChange(parsed);
							}
						}}
						disabled={disabled}
					>
						<SelectTrigger className="h-8 w-16">
							<SelectValue placeholder="Afficher:" />
						</SelectTrigger>
						<SelectContent className="bg-background">
							{itemsPerPageOptions.map((option) => (
								<SelectItem
									key={option}
									value={option.toString()}
									label={option.toString()}
								>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</HStack>
			)}
		</VStack>
	);
};
