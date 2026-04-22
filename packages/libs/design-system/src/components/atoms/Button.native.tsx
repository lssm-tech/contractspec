import {
	Button as NativeButton,
	type ButtonProps as NativeButtonProps,
} from '@contractspec/lib.ui-kit/ui/button';
import { HStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { ActivityIndicator, type PressableProps } from 'react-native';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedNode,
	useTranslatedText,
} from '../primitives/themed';

type SpinnerPlacement = 'start' | 'end';

export type ButtonProps = NativeButtonProps &
	Omit<PressableProps, 'disabled'> & {
		loading?: boolean;
		loadingText?: string;
		spinnerPlacement?: SpinnerPlacement;
	} & ThemedPrimitiveProps;

export function Button({
	children,
	loading,
	loadingText,
	spinnerPlacement = 'start',
	disabled,
	className,
	componentKey,
	themeVariant,
	labelI18n,
	ariaLabelI18n,
	...props
}: ButtonProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Button',
		componentKey,
		themeVariant,
		className,
	});
	const translateNode = useTranslatedNode();
	const translate = useTranslatedText();
	const isDisabled = Boolean(disabled || loading);

	const content = loading ? (
		<HStack className="items-center gap-x-2">
			{spinnerPlacement === 'start' ? (
				<ActivityIndicator
					size="small"
					color={props.variant === 'outline' ? '#6b7280' : '#ffffff'}
				/>
			) : null}
			<Text>{loadingText || 'Loading…'}</Text>
			{spinnerPlacement === 'end' ? (
				<ActivityIndicator
					size="small"
					color={props.variant === 'outline' ? '#6b7280' : '#ffffff'}
				/>
			) : null}
		</HStack>
	) : (
		translateNode(labelI18n ?? children)
	);

	return (
		<NativeButton
			{...(themed.props as NativeButtonProps)}
			disabled={isDisabled}
			className={themed.className}
			accessibilityLabel={translate(ariaLabelI18n)}
			{...props}
		>
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
			{content as any}
		</NativeButton>
	);
}

export default Button;
