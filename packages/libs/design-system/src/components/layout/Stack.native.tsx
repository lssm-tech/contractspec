import {
	Box as NativeBox,
	HStack as NativeHStack,
	VStack as NativeVStack,
} from '@contractspec/lib.ui-kit/ui/stack';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

type NativeBoxProps = React.ComponentProps<typeof NativeBox>;
type NativeHStackProps = React.ComponentProps<typeof NativeHStack>;
type NativeVStackProps = React.ComponentProps<typeof NativeVStack>;

export type BoxProps = NativeBoxProps & ThemedPrimitiveProps;
export type HStackProps = NativeHStackProps & ThemedPrimitiveProps;
export type VStackProps = NativeVStackProps & ThemedPrimitiveProps;

export function Box({
	componentKey,
	themeVariant,
	className,
	...props
}: BoxProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Box',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeBox
			{...(themed.props as NativeBoxProps)}
			{...props}
			className={themed.className}
		/>
	);
}

export function HStack({
	componentKey,
	themeVariant,
	className,
	...props
}: HStackProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'HStack',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeHStack
			{...(themed.props as NativeHStackProps)}
			{...props}
			className={themed.className}
		/>
	);
}

export function VStack({
	componentKey,
	themeVariant,
	className,
	...props
}: VStackProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'VStack',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeVStack
			{...(themed.props as NativeVStackProps)}
			{...props}
			className={themed.className}
		/>
	);
}
