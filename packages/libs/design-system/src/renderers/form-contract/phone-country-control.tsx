import type {
	FormOption,
	PhoneFieldSpec,
} from '@contractspec/lib.contracts-spec/forms';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/forms/controls/Select';
import { HStack } from '../../components/layout/Stack';
import { optionValue } from '../../components/primitives/control';
import { useTranslatedText } from '../../components/primitives/themed';
import { countryCallingCode, countryFlag } from './phone-country-utils';
import { FORM_FALLBACK_TEXT } from './values';

export function PhoneFlag(props: { iso2?: string; hidden?: boolean }) {
	if (props.hidden) return null;
	const flag = countryFlag(props.iso2);
	if (!flag) return null;
	return (
		<span aria-label={props.iso2} className="shrink-0 text-lg" role="img">
			{flag}
		</span>
	);
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
					id={props.id}
					name={props.name}
					value={props.selectValue}
					onChange={(next) => props.onCountryChange(optionValue(next))}
					options={props.selectOptions}
					disabled={props.disabled || props.readOnly}
				/>
			) : (
				<Input
					id={props.id}
					name={props.name}
					value={props.countryCode}
					onChange={(event) => props.onCountryChange(event.currentTarget.value)}
					placeholder={translate(
						props.parts?.placeholdersI18n?.countryCode ??
							FORM_FALLBACK_TEXT.countryCode
					)}
					aria-label={translate(FORM_FALLBACK_TEXT.countryCode)}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			)}
			{props.display.callingCode ? (
				<span className="min-w-12 text-muted-foreground text-sm">
					{countryCallingCode(props.countryIso2) || props.countryCode}
				</span>
			) : null}
		</HStack>
	);
}
