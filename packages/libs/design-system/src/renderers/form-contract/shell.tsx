import {
	CalendarIcon,
	ClockIcon,
	InfoIcon,
	MailIcon,
	SearchIcon,
	UserIcon,
} from 'lucide-react';
import type * as React from 'react';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { InputPassword } from '../../components/atoms/InputPassword';
import { Textarea } from '../../components/atoms/Textarea';
import {
	FieldDescription,
	FieldError,
	FieldLabel,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
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

export const TranslatedPasswordInput = (
	props: React.ComponentProps<typeof InputPassword> & {
		showLabelI18n?: string;
		hideLabelI18n?: string;
	}
) => {
	const translate = useTranslatedText();
	const { showLabelI18n, hideLabelI18n, ...inputProps } = props;
	return (
		<InputPassword
			{...inputProps}
			placeholder={translate(props.placeholder)}
			showLabel={translate(showLabelI18n ?? props.showLabel)}
			hideLabel={translate(hideLabelI18n ?? props.hideLabel)}
		/>
	);
};

export const TranslatedTextarea = (
	props: React.ComponentProps<typeof Textarea>
) => {
	const translate = useTranslatedText();
	return <Textarea {...props} placeholder={translate(props.placeholder)} />;
};

export const TranslatedInputGroupInput = (
	props: React.ComponentProps<typeof InputGroupInput>
) => {
	const translate = useTranslatedText();
	return (
		<InputGroupInput {...props} placeholder={translate(props.placeholder)} />
	);
};

export const TranslatedInputGroupTextarea = (
	props: React.ComponentProps<typeof InputGroupTextarea>
) => {
	const translate = useTranslatedText();
	return (
		<InputGroupTextarea {...props} placeholder={translate(props.placeholder)} />
	);
};

export const TranslatedInputGroupText = (
	props: React.ComponentProps<typeof InputGroupText>
) => {
	const translate = useTranslatedNode();
	return (
		<InputGroupText {...props}>{translate(props.children)}</InputGroupText>
	);
};

const inputGroupIcons: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	calendar: CalendarIcon,
	clock: ClockIcon,
	info: InfoIcon,
	mail: MailIcon,
	search: SearchIcon,
	user: UserIcon,
};

export const InputGroupIcon = ({
	iconKey,
	label,
}: {
	iconKey: string;
	label?: string;
}) => {
	const Icon = inputGroupIcons[iconKey] ?? InfoIcon;
	return (
		<Icon
			aria-hidden={label ? undefined : true}
			aria-label={label}
			className="size-4"
		/>
	);
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
