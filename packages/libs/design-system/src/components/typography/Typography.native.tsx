import { Text as NativeText } from '@contractspec/lib.ui-kit/ui/text';
import {
	BlockQuote as NativeBlockQuote,
	Code as NativeCode,
	H1 as NativeH1,
	H2 as NativeH2,
	H3 as NativeH3,
	H4 as NativeH4,
	Large as NativeLarge,
	Lead as NativeLead,
	Muted as NativeMuted,
	P as NativeP,
	Small as NativeSmall,
} from '@contractspec/lib.ui-kit/ui/typography';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

type ThemedTextProps = React.ComponentProps<typeof NativeText> &
	ThemedPrimitiveProps;
type ThemedTypographyProps<TComponent extends React.ElementType> =
	React.ComponentProps<TComponent> & ThemedPrimitiveProps;

function useThemedTypography({
	defaultComponentKey,
	componentKey,
	themeVariant,
	className,
}: ThemedPrimitiveProps & {
	defaultComponentKey: string;
	className?: string;
}) {
	return useThemedPrimitive({
		defaultComponentKey,
		componentKey,
		themeVariant,
		className,
	});
}

export function Text({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTextProps) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Text',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeText
			{...(themed.props as React.ComponentProps<typeof NativeText>)}
			{...props}
			className={themed.className}
		/>
	);
}

function createNativeTypography<TComponent extends React.ElementType>(
	Component: TComponent,
	defaultComponentKey: string
) {
	return function ThemedTypography({
		componentKey,
		themeVariant,
		className,
		...props
	}: ThemedTypographyProps<TComponent>) {
		const themed = useThemedTypography({
			defaultComponentKey,
			componentKey,
			themeVariant,
			className,
		});
		const NativeComponent = Component as React.ElementType;
		return (
			<NativeComponent
				{...themed.props}
				{...props}
				className={themed.className}
			/>
		);
	};
}

export const H1 = createNativeTypography(NativeH1, 'H1');
export const H2 = createNativeTypography(NativeH2, 'H2');
export const H3 = createNativeTypography(NativeH3, 'H3');
export const H4 = createNativeTypography(NativeH4, 'H4');
export const P = createNativeTypography(NativeP, 'P');
export const Lead = createNativeTypography(NativeLead, 'Lead');
export const Large = createNativeTypography(NativeLarge, 'Large');
export const Small = createNativeTypography(NativeSmall, 'Small');
export const Muted = createNativeTypography(NativeMuted, 'Muted');
export const Code = createNativeTypography(NativeCode, 'Code');
export const BlockQuote = createNativeTypography(
	NativeBlockQuote,
	'BlockQuote'
);
