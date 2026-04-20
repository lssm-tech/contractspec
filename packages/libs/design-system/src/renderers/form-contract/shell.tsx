import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type * as React from 'react';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Textarea } from '../../components/atoms/Textarea';
import {
	FieldDescription,
	FieldError,
	FieldLabel,
} from '../../components/forms/controls/Field';
import { HStack, VStack } from '../../components/layout/Stack';
import {
	useTranslatedNode,
	useTranslatedText,
} from '../../components/primitives/themed';

export const TranslatedFieldLabel = (
	props: React.ComponentProps<typeof FieldLabel>
) => {
	const translate = useTranslatedNode();
	return <FieldLabel {...props}>{translate(props.children)}</FieldLabel>;
};

export const TranslatedFieldDescription = (
	props: React.ComponentProps<typeof FieldDescription>
) => {
	const translate = useTranslatedNode();
	return (
		<FieldDescription {...props}>{translate(props.children)}</FieldDescription>
	);
};

export const TranslatedFieldError = (
	props: React.ComponentProps<typeof FieldError>
) => {
	const translate = useTranslatedNode();
	return <FieldError {...props}>{translate(props.children)}</FieldError>;
};

export const TranslatedInput = (props: React.ComponentProps<typeof Input>) => {
	const translate = useTranslatedText();
	return <Input {...props} placeholder={translate(props.placeholder)} />;
};

export const TranslatedTextarea = (
	props: React.ComponentProps<typeof Textarea>
) => {
	const translate = useTranslatedText();
	return <Textarea {...props} placeholder={translate(props.placeholder)} />;
};

type TranslatedButtonProps = Omit<
	React.ComponentProps<typeof Button>,
	'onClick' | 'onPress'
> & {
	onClick?: () => void;
	onPress?: () => void;
};

export const TranslatedButton = ({
	children,
	onClick,
	onPress,
	...props
}: TranslatedButtonProps) => {
	const translate = useTranslatedNode();
	return (
		<Button
			{...(props as React.ComponentProps<typeof Button>)}
			onClick={onClick ? () => onClick() : undefined}
			onPress={onPress ?? onClick}
		>
			{translate(children)}
		</Button>
	);
};

export const FormRoot = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="lg" className={className}>
		{children}
	</VStack>
);

export const FieldArray = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="md" className={className}>
		{children}
	</VStack>
);

export const FieldArrayItem = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="sm" className={className}>
		{children}
	</VStack>
);

export const Actions = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<HStack gap="sm" wrap="wrap" className={className}>
		{children}
	</HStack>
);

export const FieldLegend = (props: React.ComponentProps<typeof Text>) => {
	const translate = useTranslatedNode();
	return <Text {...props}>{translate(props.children)}</Text>;
};
