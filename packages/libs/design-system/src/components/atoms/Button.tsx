import {
	Button as WebButton,
	type ButtonProps as WebButtonProps,
} from '@contractspec/lib.ui-kit-web/ui/button';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedNode,
	useTranslatedText,
} from '../primitives/themed';

type SpinnerPlacement = 'start' | 'end';

export type ButtonProps = Omit<
	WebButtonProps,
	'onClick' | 'disabled' | 'children'
> & {
	// PressableBridgeProps & {
	children: React.ReactNode;
	loading?: boolean;
	loadingText?: string; // ignored on web, present for API symmetry
	spinnerPlacement?: SpinnerPlacement;
	// Normalized events
	onPress?: () => void;
	onPressIn?: () => void;
	onPressOut?: () => void;
	onLongPress?: () => void;
	// Web-only optional onClick for compatibility
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
} & ThemedPrimitiveProps;

export function Button({
	children,
	loading,
	spinnerPlacement = 'start',
	onPress,
	onPressIn,
	onPressOut,
	onLongPress,
	onTouchStart,
	onTouchEnd,
	onTouchCancel,
	onMouseDown,
	onMouseUp,
	onClick,
	className,
	disabled,
	componentKey,
	themeVariant,
	labelI18n,
	ariaLabelI18n,
	...rest
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
	const handleClick = onPress
		? () => {
				onPress();
			}
		: onClick;

	const content = !rest.asChild ? (
		<>
			{loading && spinnerPlacement === 'start' ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : null}
			{translateNode(labelI18n ?? children)}
			{loading && spinnerPlacement === 'end' ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : null}
		</>
	) : (
		translateNode(labelI18n ?? children)
	);

	return (
		<WebButton
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(themed.props as any)}
			{...(rest as any)}
			className={themed.className}
			disabled={isDisabled}
			aria-busy={loading ? true : undefined}
			aria-disabled={isDisabled ? true : undefined}
			aria-label={translate(ariaLabelI18n)}
			onClick={handleClick}
			onMouseDown={onMouseDown || onPressIn}
			onMouseUp={onMouseUp || onPressOut}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd || onPressOut}
			onTouchCancel={onTouchCancel || onPressOut}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			type={(rest as any)?.type ?? 'button'}
		>
			{content}
		</WebButton>
	);
}
