import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import React from 'react';
import { View } from 'react-native';
import { Button } from '../../button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../select';
import { Text } from '../../text';
import type { PaginationProps } from './types';

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
	const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const endItem =
		totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

	const canGoPrevious = currentPage > 1 && !disabled;
	const canGoNext = currentPage < totalPages && !disabled;

	const getVisiblePageNumbers = () => {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= 3) {
			return [1, 2, 3, 4, 5, -1, totalPages]; // -1 represents ellipsis
		}

		if (currentPage >= totalPages - 2) {
			return [
				1,
				-1,
				totalPages - 4,
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		}

		return [
			1,
			-1,
			currentPage - 1,
			currentPage,
			currentPage + 1,
			-1,
			totalPages,
		];
	};

	if (totalPages === 0) return null;

	return (
		<View
			className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${className}`}
		>
			{/* Items info */}
			<View className="order-2 text-base text-muted-foreground sm:order-1">
				Affichage de {startItem} à {endItem} sur {totalItems} résultats
			</View>

			{/* Pagination controls */}
			<View className="order-1 flex items-center gap-2 sm:order-2">
				{/* First page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(1)}
					disabled={!canGoPrevious}
					className="hidden h-8 w-8 p-0 sm:flex"
				>
					<ChevronsLeft className="h-4 w-4" />
					<Text className="sr-only">Première page</Text>
				</Button>

				{/* Previous page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(currentPage - 1)}
					disabled={!canGoPrevious}
					className="h-8 w-8 p-0"
				>
					<ChevronLeft className="h-4 w-4" />
					<Text className="sr-only">Page précédente</Text>
				</Button>

				{/* Page numbers */}
				<View className="flex items-center gap-1">
					{getVisiblePageNumbers().map((page, index) => {
						if (page === -1) {
							return (
								<View
									key={`ellipsis-${index}`}
									className="px-2 py-1 text-muted-foreground"
								>
									...
								</View>
							);
						}

						return (
							<Button
								key={page}
								variant={page === currentPage ? 'default' : 'outline'}
								size="sm"
								onPress={() => onPageChange(page)}
								disabled={disabled}
								className="h-8 min-w-8 px-2"
							>
								<Text>{page}</Text>
							</Button>
						);
					})}
				</View>

				{/* Next page */}
				<Button
					variant="outline"
					size="sm"
					onPress={() => onPageChange(currentPage + 1)}
					disabled={!canGoNext}
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
					className="hidden h-8 w-8 p-0 sm:flex"
				>
					<ChevronsRight className="h-4 w-4" />
					<Text className="sr-only">Dernière page</Text>
				</Button>
			</View>

			{/* Items per page */}
			{showItemsPerPage && onItemsPerPageChange && (
				<View className="order-3 flex items-center gap-2 text-base">
					<Text className="text-muted-foreground">Afficher:</Text>
					<Select
						value={{
							value: itemsPerPage.toString(),
							label: itemsPerPage.toString(),
						}}
						onValueChange={(value) => {
							const parsed = parseInt(value?.value ?? '', 10);
							if (!Number.isNaN(parsed)) {
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
				</View>
			)}
		</View>
	);
};
