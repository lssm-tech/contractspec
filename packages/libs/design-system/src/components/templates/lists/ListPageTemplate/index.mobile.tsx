import type { ListRenderItem } from 'react-native';
import { FiltersToolbar } from '../../../molecules/FiltersToolbar.mobile';
import { FlatListScreen } from '../../../native/FlatListScreen.mobile';
import { EmptyDataList } from '../../../organisms/EmptyDataList.mobile';
import { PageHeaderResponsive } from '../../../organisms/PageHeaderResponsive.mobile';
import type { ListPageTemplateProps } from './types';

export * from './types';

export function ListPageTemplate<T = unknown>({
	children: _children,
	title,
	description,
	breadcrumb,
	actions,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	onSearchSubmit,
	isLoading,
	data,
	renderItem,
	emptyProps,
}: ListPageTemplateProps<T>) {
	const header = (
		<>
			<PageHeaderResponsive
				title={title}
				subtitle={description}
				breadcrumb={breadcrumb}
				actions={actions}
			/>
			<FiltersToolbar
				searchPlaceholder={searchPlaceholder}
				searchValue={searchValue}
				onSearchChange={onSearchChange}
				onSearchSubmit={onSearchSubmit}
			/>
		</>
	);

	return (
		<FlatListScreen
			refreshing={isLoading}
			header={header}
			data={data ?? []}
			renderItem={renderItem as unknown as ListRenderItem<T>}
			showsVerticalScrollIndicator={false}
			padding="md"
			emptyComponent={
				emptyProps ? <EmptyDataList {...emptyProps} /> : undefined
			}
		/>
	);
}
