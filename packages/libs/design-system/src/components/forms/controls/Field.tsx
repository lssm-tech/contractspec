'use client';

import {
	Field as WebField,
	FieldDescription as WebFieldDescription,
	FieldError as WebFieldError,
	FieldGroup as WebFieldGroup,
	FieldLabel as WebFieldLabel,
} from '@contractspec/lib.ui-kit-web/ui/field';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedNode,
} from '../../primitives/themed';

type FieldBaseProps<TProps> = TProps & ThemedPrimitiveProps;

export type FieldProps = FieldBaseProps<React.ComponentProps<typeof WebField>>;
export function Field({
	componentKey,
	themeVariant,
	className,
	...props
}: FieldProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Field',
		componentKey,
		themeVariant,
		className,
	});
	return <WebField {...themed.props} {...props} className={themed.className} />;
}

export type FieldLabelProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldLabel>
>;
export function FieldLabel({
	componentKey,
	themeVariant,
	className,
	children,
	...props
}: FieldLabelProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldLabel',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedNode();
	return (
		<WebFieldLabel {...themed.props} {...props} className={themed.className}>
			{translate(children)}
		</WebFieldLabel>
	);
}

export type FieldDescriptionProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldDescription>
>;
export function FieldDescription({
	componentKey,
	themeVariant,
	className,
	children,
	...props
}: FieldDescriptionProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldDescription',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedNode();
	return (
		<WebFieldDescription
			{...themed.props}
			{...props}
			className={themed.className}
		>
			{translate(children)}
		</WebFieldDescription>
	);
}

export type FieldErrorProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldError>
>;
export function FieldError({
	componentKey,
	themeVariant,
	className,
	children,
	...props
}: FieldErrorProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldError',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedNode();
	return (
		<WebFieldError {...themed.props} {...props} className={themed.className}>
			{translate(children)}
		</WebFieldError>
	);
}

export { WebFieldGroup as FieldGroup };
