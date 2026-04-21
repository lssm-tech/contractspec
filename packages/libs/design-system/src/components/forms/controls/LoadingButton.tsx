'use client';

import {
	LoadingButton as WebLoadingButton,
	type LoadingButtonProps as WebLoadingButtonProps,
} from '@contractspec/lib.ui-kit-web/ui/loading-button';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedNode,
	useTranslatedText,
} from '../../primitives/themed';

export type LoadingButtonProps = WebLoadingButtonProps & ThemedPrimitiveProps;

export function LoadingButton({
	componentKey,
	themeVariant,
	className,
	children,
	loadingText,
	labelI18n,
	...props
}: LoadingButtonProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'LoadingButton',
		componentKey,
		themeVariant,
		className,
	});
	const translateNode = useTranslatedNode();
	const translate = useTranslatedText();
	return (
		<WebLoadingButton
			{...themed.props}
			{...props}
			className={themed.className}
			loadingText={translate(loadingText)}
		>
			{translateNode(labelI18n ?? children)}
		</WebLoadingButton>
	);
}
