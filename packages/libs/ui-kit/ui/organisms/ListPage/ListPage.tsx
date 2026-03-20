import { AlertTriangle, Loader2, Plus, RefreshCcw } from 'lucide-react';
import { View } from 'react-native';
import type { FilterOption } from '../../atoms/FilterSelect/types';
import { Pagination } from '../../atoms/Pagination';
import { Button } from '../../button';
import { Card, CardContent } from '../../card';
import { SearchAndFilter } from '../../molecules/SearchAndFilter';
import { Separator } from '../../separator';
import { HStack, VStack } from '../../stack';
import { Text } from '../../text';
import { P } from '../../typography';
import type { ListPageProps } from './types';

export function ListPage<T>({
	title,
	description,
	header,
	items,
	totalItems,
	totalPages,
	isLoading,
	isFetching,
	error,
	listState,
	searchPlaceholder,
	filters = [],
	onRefresh,
	primaryAction,
	toolbar,
	renderItem,
	renderEmpty,
	renderStats,
	className = '',
	itemClassName = '',
	linkComponent,
}: ListPageProps<T>) {
	const LinkComponent = linkComponent;
	const {
		searchQuery,
		setSearchQuery,
		filters: filterValues,
		setFilter,
		currentPage,
		itemsPerPage,
		setCurrentPage,
		setItemsPerPage,
	} = listState;

	// Loading state with no items
	if (isLoading && !items.length) {
		return (
			<VStack className={`space-y-4 md:space-y-6 ${className}`}>
				{header ? (
					header
				) : (
					<VStack className="gap-1">
						<Text className="font-bold text-2xl md:text-3xl">{title}</Text>
						{description && (
							<P className="text-base text-muted-foreground">{description}</P>
						)}
					</VStack>
				)}

				<View className="flex min-h-[400px] items-center justify-center">
					<Card>
						<CardContent className="flex items-center gap-4 p-6">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<View>
								<Text className="font-medium">Chargement...</Text>
								<P className="text-base text-muted-foreground">
									Récupération des données en cours
								</P>
							</View>
						</CardContent>
					</Card>
				</View>
			</VStack>
		);
	}

	// Error state with no items
	if (error && !items.length) {
		return (
			<VStack className={`space-y-4 md:space-y-6 ${className}`}>
				{header ? (
					header
				) : (
					<VStack className="gap-1">
						<Text className="font-bold text-2xl md:text-3xl">{title}</Text>
						{description && (
							<P className="text-base text-muted-foreground">{description}</P>
						)}
					</VStack>
				)}

				<View className="flex min-h-[400px] items-center justify-center">
					<Card>
						<CardContent className="flex flex-col items-center gap-4 p-6 text-center">
							<AlertTriangle className="h-12 w-12 text-destructive" />
							<View>
								<Text className="font-medium">Erreur de chargement</Text>
								<P className="text-base text-muted-foreground">
									{error.message || 'Une erreur est survenue'}
								</P>
							</View>
							{onRefresh && (
								<Button onPress={onRefresh} variant="outline" size="sm">
									<RefreshCcw className="mr-2 h-4 w-4" />
									Réessayer
								</Button>
							)}
						</CardContent>
					</Card>
				</View>
			</VStack>
		);
	}

	// Prepare filter configurations
	const filterConfigs = filters.map((filter) => ({
		key: filter.key,
		label: filter.label,
		value: filterValues[filter.key] || '',
		options: filter.options,
		onChange: (value: FilterOption | undefined) => {
			setFilter(filter.key, value?.value || '');
		},
		showCounts: filter.showCounts,
	}));

	return (
		<VStack className={`space-y-4 md:space-y-6 ${className}`}>
			{/* Header */}
			{header ? (
				header
			) : (
				<HStack className="items-center justify-between">
					<VStack className="gap-1">
						<h1 className="font-bold text-2xl md:text-3xl">{title}</h1>
						{description && (
							<p className="text-base text-muted-foreground">{description}</p>
						)}
					</VStack>

					<HStack className="items-center gap-4">
						{toolbar}
						{(isLoading || isFetching) && (
							<div className="flex items-center gap-2 text-base text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								<Text className="hidden sm:inline">Mise à jour...</Text>
							</div>
						)}

						{onRefresh && (
							<Button
								variant="outline"
								size="sm"
								onPress={onRefresh}
								disabled={Boolean(isLoading)}
								aria-label="Rafraîchir"
							>
								<RefreshCcw
									className={`mr-2 h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`}
								/>
								<Text className="hidden sm:inline">Rafraîchir</Text>
							</Button>
						)}

						{primaryAction && (
							<>
								{primaryAction.href ? (
									LinkComponent ? (
										<LinkComponent href={primaryAction.href}>
											<Button>
												{primaryAction.icon || (
													<Plus className="mr-2 h-4 w-4" />
												)}
												<Text className="hidden sm:inline">
													{primaryAction.label}
												</Text>
												<Text className="sm:hidden">Nouveau</Text>
											</Button>
										</LinkComponent>
									) : (
										<Button onPress={primaryAction.onClick ?? undefined}>
											{primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
											<Text className="hidden sm:inline">
												{primaryAction.label}
											</Text>
											<Text className="sm:hidden">Nouveau</Text>
										</Button>
									)
								) : (
									<Button onPress={primaryAction.onClick}>
										{primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
										<Text className="hidden sm:inline">
											{primaryAction.label}
										</Text>
										<Text className="sm:hidden">Nouveau</Text>
									</Button>
								)}
							</>
						)}
					</HStack>
				</HStack>
			)}

			{/* Stats (optional) */}
			{renderStats && (
				<>
					{renderStats(items)}
					<Separator />
				</>
			)}

			{/* Search and Filters */}
			<SearchAndFilter
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				searchPlaceholder={searchPlaceholder}
				filters={filterConfigs}
				isLoading={isLoading}
			/>

			{/* Content */}
			{items.length === 0 && !isLoading ? (
				renderEmpty ? (
					renderEmpty()
				) : (
					<Card>
						<CardContent className="flex flex-col items-center gap-4 p-8 text-center">
							<View className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
								<View className="h-6 w-6 rounded-full bg-muted-foreground/20" />
							</View>
							<View>
								<Text className="font-medium">Aucun élément trouvé</Text>
								<P className="text-base text-muted-foreground">
									{searchQuery || Object.values(filterValues).some((v) => v)
										? 'Essayez de modifier vos critères de recherche'
										: 'Commencez par créer votre premier élément'}
								</P>
							</View>
							{primaryAction &&
								!searchQuery &&
								!Object.values(filterValues).some((v) => v) && (
									<>
										{primaryAction.href ? (
											LinkComponent ? (
												<LinkComponent href={primaryAction.href}>
													<Button>
														{primaryAction.icon || (
															<Plus className="mr-2 h-4 w-4" />
														)}
														{primaryAction.label}
													</Button>
												</LinkComponent>
											) : (
												<Button onPress={primaryAction.onClick ?? undefined}>
													{primaryAction.icon || (
														<Plus className="mr-2 h-4 w-4" />
													)}
													{primaryAction.label}
												</Button>
											)
										) : (
											<Button onPress={primaryAction.onClick}>
												{primaryAction.icon || (
													<Plus className="mr-2 h-4 w-4" />
												)}
												{primaryAction.label}
											</Button>
										)}
									</>
								)}
						</CardContent>
					</Card>
				)
			) : (
				<>
					{/* Items List */}
					<View className={`space-y-4 ${itemClassName}`}>
						{items.map((item, index) => renderItem(item, index))}
					</View>

					{/* Pagination */}
					{totalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							onPageChange={setCurrentPage}
							onItemsPerPageChange={setItemsPerPage}
							disabled={isLoading}
						/>
					)}
				</>
			)}
		</VStack>
	);
}
