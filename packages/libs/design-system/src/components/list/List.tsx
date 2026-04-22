'use client';

import {
	List as WebList,
	ListItem as WebListItem,
	type ListItemProps as WebListItemProps,
	type ListProps as WebListProps,
} from '@contractspec/lib.ui-kit-web/ui/list';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

export type ListProps = WebListProps & ThemedPrimitiveProps;
export type ListItemProps = WebListItemProps & ThemedPrimitiveProps;

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
	return <WebList {...themed.props} {...props} className={themed.className} />;
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
		<WebListItem {...themed.props} {...props} className={themed.className} />
	);
}
