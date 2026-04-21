'use client';

import {
	NativeSelectOptGroup,
	NativeSelect as WebNativeSelect,
	NativeSelectOption as WebNativeSelectOption,
} from '@contractspec/lib.ui-kit-web/ui/native-select';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

export type NativeSelectProps = React.ComponentProps<typeof WebNativeSelect> &
	ThemedPrimitiveProps;

export function NativeSelect({
	componentKey,
	themeVariant,
	className,
	placeholderI18n: _placeholderI18n,
	...props
}: NativeSelectProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'NativeSelect',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebNativeSelect
			{...themed.props}
			{...props}
			className={themed.className}
		/>
	);
}

export function NativeSelectOption(props: React.ComponentProps<'option'>) {
	const translate = useTranslatedText();
	return (
		<WebNativeSelectOption {...props}>
			{typeof props.children === 'string'
				? translate(props.children)
				: props.children}
		</WebNativeSelectOption>
	);
}

export { NativeSelectOptGroup };
