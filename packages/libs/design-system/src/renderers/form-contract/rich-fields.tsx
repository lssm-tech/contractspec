import type {
	AddressFormValue,
	FormOption,
} from '@contractspec/lib.contracts-spec/forms';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/forms/controls/Select';
import { VStack } from '../../components/layout/Stack';
import { inputValue, optionValue } from '../../components/primitives/control';
import { useTranslatedText } from '../../components/primitives/themed';
import { FORM_FALLBACK_TEXT, updateAddress } from './values';

export { PhoneField } from './phone-field';

export const AddressField = (props: {
	value?: AddressFormValue | null;
	onChange?: (value: AddressFormValue) => void;
	parts?: {
		labelsI18n?: Partial<Record<keyof AddressFormValue, string>>;
		placeholdersI18n?: Partial<Record<keyof AddressFormValue, string>>;
	};
	countryOptions?: FormOption[];
	readOnly?: boolean;
	disabled?: boolean;
}) => {
	const translate = useTranslatedText();
	return (
		<VStack gap="sm">
			<Input
				value={props.value?.line1 ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'line1', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.line1 ??
						FORM_FALLBACK_TEXT.addressLine1
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.line2 ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'line2', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.line2 ??
						FORM_FALLBACK_TEXT.addressLine2
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.city ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'city', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.city ?? FORM_FALLBACK_TEXT.city
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.region ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'region', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.region ?? FORM_FALLBACK_TEXT.region
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.postalCode ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'postalCode', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.postalCode ??
						FORM_FALLBACK_TEXT.postalCode
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			{props.countryOptions?.length ? (
				<Select
					value={props.value?.countryCode ?? ''}
					onChange={(value) =>
						props.onChange?.(
							updateAddress(props.value, 'countryCode', optionValue(value))
						)
					}
					options={props.countryOptions}
					disabled={props.disabled || props.readOnly}
				/>
			) : (
				<Input
					value={props.value?.countryCode ?? ''}
					onChange={(event) =>
						props.onChange?.(
							updateAddress(props.value, 'countryCode', inputValue(event))
						)
					}
					placeholder={translate(
						props.parts?.placeholdersI18n?.countryCode ??
							FORM_FALLBACK_TEXT.countryCode
					)}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			)}
		</VStack>
	);
};
