import {
	LoadingButton as NativeLoadingButton,
	type LoadingButtonProps as NativeLoadingButtonProps,
} from '@contractspec/lib.ui-kit/ui/loading-button';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedNode,
	useTranslatedText,
} from '../../primitives/themed';

export type LoadingButtonProps = NativeLoadingButtonProps &
	ThemedPrimitiveProps;

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
		<NativeLoadingButton
			{...themed.props}
			{...props}
			className={themed.className}
			loadingText={translate(loadingText)}
		>
			{translateNode(labelI18n ?? children)}
		</NativeLoadingButton>
	);
}
