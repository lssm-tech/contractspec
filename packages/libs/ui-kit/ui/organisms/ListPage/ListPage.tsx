import React from 'react';
import { View } from 'react-native';
import { AlertTriangle, Loader2, Plus, RefreshCcw } from 'lucide-react';
import { Button } from '../../button';
import { Card, CardContent } from '../../card';
import { VStack, HStack } from '../../stack';
import { Separator } from '../../separator';
import { SearchAndFilter } from '../../molecules/SearchAndFilter';
import { Pagination } from '../../atoms/Pagination';
import { Text } from '../../text';
import { P } from '../../typography';
import type { ListPageProps } from './types';
import type { FilterOption } from '../../atoms/FilterSelect/types';

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
            <Text className="text-2xl font-bold md:text-3xl">{title}</Text>
            {description && (
              <P className="text-muted-foreground text-base">{description}</P>
            )}
          </VStack>
        )}

        <View className="flex min-h-[400px] items-center justify-center">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <View>
                <Text className="font-medium">Chargement...</Text>
                <P className="text-muted-foreground text-base">
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
            <Text className="text-2xl font-bold md:text-3xl">{title}</Text>
            {description && (
              <P className="text-muted-foreground text-base">{description}</P>
            )}
          </VStack>
        )}

        <View className="flex min-h-[400px] items-center justify-center">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <AlertTriangle className="text-destructive h-12 w-12" />
              <View>
                <Text className="font-medium">Erreur de chargement</Text>
                <P className="text-muted-foreground text-base">
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
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-base">{description}</p>
            )}
          </VStack>

          <HStack className="items-center gap-4">
            {toolbar}
            {(isLoading || isFetching) && (
              <div className="text-muted-foreground flex items-center gap-2 text-base">
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
              <View className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <View className="bg-muted-foreground/20 h-6 w-6 rounded-full" />
              </View>
              <View>
                <Text className="font-medium">Aucun élément trouvé</Text>
                <P className="text-muted-foreground text-base">
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
