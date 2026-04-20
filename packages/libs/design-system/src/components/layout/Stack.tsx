'use client';

import {
	Box as WebBox,
	HStack as WebHStack,
	VStack as WebVStack,
} from '@contractspec/lib.ui-kit-web/ui/stack';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

export type BoxProps = React.ComponentProps<typeof WebBox> &
	ThemedPrimitiveProps;
export type HStackProps = React.ComponentProps<typeof WebHStack> &
	ThemedPrimitiveProps;
export type VStackProps = React.ComponentProps<typeof WebVStack> &
	ThemedPrimitiveProps;

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
	return <WebBox {...themed.props} {...props} className={themed.className} />;
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
		<WebHStack {...themed.props} {...props} className={themed.className} />
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
		<WebVStack {...themed.props} {...props} className={themed.className} />
	);
}
