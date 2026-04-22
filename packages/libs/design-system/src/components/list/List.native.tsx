import {
	List as NativeList,
	ListItem as NativeListItem,
	type ListItemProps as NativeListItemProps,
	type ListProps as NativeListProps,
} from '@contractspec/lib.ui-kit/ui/list';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

export type ListProps = NativeListProps & ThemedPrimitiveProps;
export type ListItemProps = NativeListItemProps & ThemedPrimitiveProps;

export function List({
	componentKey,
	themeVariant,
	className,
	...props
}: ListProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'List',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeList
			{...(themed.props as NativeListProps)}
			{...props}
			className={themed.className}
		/>
	);
}

export function ListItem({
	componentKey,
	themeVariant,
	className,
	...props
}: ListItemProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'ListItem',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeListItem
			{...(themed.props as NativeListItemProps)}
			{...props}
			className={themed.className}
		/>
	);
}
