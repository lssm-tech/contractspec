import type {
	FormOption,
	PhoneFieldSpec,
} from '@contractspec/lib.contracts-spec/forms';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/forms/controls/Select';
import { HStack } from '../../components/layout/Stack';
import { inputValue, optionValue } from '../../components/primitives/control';
import { useTranslatedText } from '../../components/primitives/themed';
import { Text } from '../../components/typography/Typography';
import { countryCallingCode, countryFlag } from './phone-country-utils';
import { FORM_FALLBACK_TEXT } from './values';

export function PhoneFlag(props: { iso2?: string; hidden?: boolean }) {
	if (props.hidden) return null;
	const flag = countryFlag(props.iso2);
	if (!flag) return null;
	return <Text className="shrink-0 text-lg">{flag}</Text>;
}

export function PhoneCountryControl(props: {
	id?: string;
	name?: string;
	countryCode: string;
	countryIso2?: string;
	selectValue?: string;
	selectOptions: FormOption[];
	parts?: PhoneFieldSpec['parts'];
	display: Required<NonNullable<PhoneFieldSpec['display']>>;
	disabled?: boolean;
	readOnly?: boolean;
	onCountryChange: (raw: string) => void;
}) {
	const translate = useTranslatedText();
	return (
		<HStack align="center" gap="sm">
			<PhoneFlag iso2={props.countryIso2} hidden={!props.display.flag} />
			{props.display.countrySelect ? (
				<Select
					value={props.selectValue}
					onChange={(next) => props.onCountryChange(optionValue(next))}
					options={props.selectOptions}
					disabled={props.disabled || props.readOnly}
				/>
			) : (
				<Input
					value={props.countryCode}
					onChange={(value) => props.onCountryChange(inputValue(value))}
					placeholder={translate(
						props.parts?.placeholdersI18n?.countryCode ??
							FORM_FALLBACK_TEXT.countryCode
					)}
					ariaLabelI18n={FORM_FALLBACK_TEXT.countryCode}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			)}
			{props.display.callingCode ? (
				<Text className="min-w-12 text-muted-foreground text-sm">
					{countryCallingCode(props.countryIso2) || props.countryCode}
				</Text>
			) : null}
		</HStack>
	);
}
