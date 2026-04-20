'use client';

import {
	Combobox as WebCombobox,
	type ComboboxProps as WebComboboxProps,
} from '@contractspec/lib.ui-kit-web/ui/combobox';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

export type ComboboxProps = WebComboboxProps & ThemedPrimitiveProps;

export function Combobox({
	componentKey,
	themeVariant,
	className,
	placeholder,
	placeholderI18n,
	searchPlaceholder,
	emptyText,
	...props
}: ComboboxProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Combobox',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<WebCombobox
			{...themed.props}
			{...props}
			className={themed.className}
			placeholder={translate(placeholderI18n ?? placeholder)}
			searchPlaceholder={translate(searchPlaceholder)}
			emptyText={translate(emptyText)}
		/>
	);
}
