import type { FormOption } from '@contractspec/lib.contracts-spec/forms';

export type { FormOption };

export interface SelectOptionGroup {
	key?: string;
	label?: string;
	labelI18n?: string;
	options: readonly FormOption[];
}

export type SelectTextTranslator = (
	value: string | undefined
) => string | undefined;

export function selectOptionValue(value: unknown) {
	return typeof value === 'string' ? value : String(value ?? '');
}

export function selectOptionLabel(
	option: FormOption,
	translate: SelectTextTranslator
) {
	return translate(option.labelI18n) ?? selectOptionValue(option.labelI18n);
}

export function selectGroupLabel(
	group: SelectOptionGroup,
	translate: SelectTextTranslator
) {
	return translate(group.labelI18n ?? group.label);
}

export function selectGroupKey(group: SelectOptionGroup, index: number) {
	return group.key ?? group.labelI18n ?? group.label ?? `group-${index}`;
}

export function selectOptionGroups({
	options,
	groups,
}: {
	options?: readonly FormOption[];
	groups?: readonly SelectOptionGroup[];
}) {
	return groups?.length ? groups : [{ options: options ?? [] }];
}
