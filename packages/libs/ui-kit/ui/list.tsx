import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import type { ViewProps } from 'react-native';
import { Text, View } from 'react-native';

export type ListType = 'unordered' | 'ordered' | 'none';

const ListContext = React.createContext<ListType>('unordered');

const listVariants = cva('flex flex-col', {
	variants: {
		spacing: {
			none: 'gap-0',
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-3',
			lg: 'gap-4',
		},
	},
	defaultVariants: {
		spacing: 'sm',
	},
});

export type ListProps = ViewProps &
	VariantProps<typeof listVariants> & {
		type?: ListType;
		ref?: React.RefObject<React.ComponentRef<typeof View>>;
	};

function List({ className, type = 'unordered', spacing, ...props }: ListProps) {
	return (
		<ListContext.Provider value={type}>
			<View
				role="list"
				className={cn(listVariants({ spacing }), className)}
				{...props}
			/>
		</ListContext.Provider>
	);
}

const listItemVariants = cva('flex flex-row items-start', {
	variants: {
		tone: {
			default: '',
			muted: 'text-muted-foreground',
		},
	},
	defaultVariants: {
		tone: 'default',
	},
});

export type ListItemProps = ViewProps &
	VariantProps<typeof listItemVariants> & {
		index?: number;
		marker?: React.ReactNode | false;
		ref?: React.RefObject<React.ComponentRef<typeof View>>;
	};

function resolveMarker(
	type: ListType,
	index: number | undefined,
	marker: React.ReactNode | false | undefined
): React.ReactNode {
	if (marker !== undefined) {
		return marker;
	}
	if (type === 'none') {
		return false;
	}
	if (type === 'ordered') {
		return `${index ?? 1}.`;
	}
	return '•';
}

function ListItem({
	children,
	className,
	tone,
	index,
	marker,
	...props
}: ListItemProps) {
	const listType = React.useContext(ListContext);
	const resolvedMarker = resolveMarker(listType, index, marker);

	return (
		<View
			role="listitem"
			className={cn(listItemVariants({ tone }), className)}
			{...props}
		>
			{resolvedMarker === false ? null : (
				<Text className="mr-2 min-w-4 text-foreground">{resolvedMarker}</Text>
			)}
			<View className="flex-1">{children}</View>
		</View>
	);
}

export { List, ListItem, listItemVariants, listVariants };
