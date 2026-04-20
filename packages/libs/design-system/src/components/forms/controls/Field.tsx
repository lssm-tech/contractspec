'use client';

import {
	Field as WebField,
	FieldContent as WebFieldContent,
	FieldDescription as WebFieldDescription,
	FieldError as WebFieldError,
	FieldGroup as WebFieldGroup,
	FieldLabel as WebFieldLabel,
	FieldLegend as WebFieldLegend,
	FieldSeparator as WebFieldSeparator,
	FieldSet as WebFieldSet,
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
	layout: _layout,
	...props
}: FieldProps & { layout?: unknown }) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Field',
		componentKey,
		themeVariant,
		className,
	});
	return <WebField {...themed.props} {...props} className={themed.className} />;
}

export type FieldSetProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldSet>
>;
export function FieldSet({
	componentKey,
	themeVariant,
	className,
	...props
}: FieldSetProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldSet',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebFieldSet {...themed.props} {...props} className={themed.className} />
	);
}

export type FieldLegendProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldLegend>
>;
export function FieldLegend({
	componentKey,
	themeVariant,
	className,
	children,
	...props
}: FieldLegendProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldLegend',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedNode();
	return (
		<WebFieldLegend {...themed.props} {...props} className={themed.className}>
			{translate(children)}
		</WebFieldLegend>
	);
}

export type FieldContentProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldContent>
>;
export function FieldContent({
	componentKey,
	themeVariant,
	className,
	...props
}: FieldContentProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldContent',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebFieldContent
			{...themed.props}
			{...props}
			className={themed.className}
		/>
	);
}

export type FieldGroupProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldGroup>
> & { layout?: unknown };
export function FieldGroup({
	componentKey,
	themeVariant,
	className,
	layout: _layout,
	...props
}: FieldGroupProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldGroup',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebFieldGroup {...themed.props} {...props} className={themed.className} />
	);
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

export type FieldSeparatorProps = FieldBaseProps<
	React.ComponentProps<typeof WebFieldSeparator>
>;
export function FieldSeparator({
	componentKey,
	themeVariant,
	className,
	children,
	...props
}: FieldSeparatorProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'FieldSeparator',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedNode();
	return (
		<WebFieldSeparator
			{...themed.props}
			{...props}
			className={themed.className}
		>
			{translate(children)}
		</WebFieldSeparator>
	);
}

export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from '@contractspec/lib.ui-kit-web/ui/input-group';
