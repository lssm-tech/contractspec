import { describe, expect, it, mock } from 'bun:test';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../../../i18n/translation';

interface MockSelectRootProps {
	children?: ReactNode;
	value?: unknown;
	disabled?: boolean;
}

interface MockSelectItemProps {
	children?: ReactNode;
	disabled?: boolean;
	label?: string;
	value?: string;
}

interface MockSelectValueProps {
	placeholder?: string;
}

function optionRecord(value: unknown) {
	return typeof value === 'object' && value !== null
		? (value as { label?: unknown; value?: unknown })
		: undefined;
}

mock.module('@contractspec/lib.ui-kit-web/ui/select', () => ({
	Select: ({ children, disabled, value }: MockSelectRootProps) => (
		<div data-disabled={disabled || undefined} data-value={String(value ?? '')}>
			{children}
		</div>
	),
	SelectContent: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-content">{children}</div>
	),
	SelectGroup: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-group">{children}</div>
	),
	SelectItem: ({ children, disabled, value }: MockSelectItemProps) => (
		<div
			data-disabled={disabled || undefined}
			data-slot="select-item"
			data-value={value}
		>
			{children}
		</div>
	),
	SelectLabel: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-label">{children}</div>
	),
	SelectTrigger: ({ children }: { children?: ReactNode }) => (
		<button type="button">{children}</button>
	),
	SelectValue: ({ placeholder }: MockSelectValueProps) => (
		<span>{placeholder}</span>
	),
}));

mock.module('@contractspec/lib.ui-kit/ui/select', () => ({
	Select: ({ children, disabled, value }: MockSelectRootProps) => {
		const selected = optionRecord(value);

		return (
			<div
				data-disabled={disabled || undefined}
				data-label={String(selected?.label ?? '')}
				data-value={String(selected?.value ?? '')}
			>
				{children}
			</div>
		);
	},
	SelectContent: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-content">{children}</div>
	),
	SelectGroup: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-group">{children}</div>
	),
	SelectItem: ({ disabled, label, value }: MockSelectItemProps) => (
		<div
			data-disabled={disabled || undefined}
			data-label={label}
			data-slot="select-item"
			data-value={value}
		/>
	),
	SelectLabel: ({ children }: { children?: ReactNode }) => (
		<div data-slot="select-label">{children}</div>
	),
	SelectTrigger: ({ children }: { children?: ReactNode }) => (
		<button type="button">{children}</button>
	),
	SelectValue: ({ placeholder }: MockSelectValueProps) => (
		<span>{placeholder}</span>
	),
}));

const translations = new TranslationRegistry([
	defineTranslation({
		meta: {
			key: 'design-system.select',
			version: '1.0.0',
			domain: 'design-system',
			owners: ['platform.design'],
		},
		locale: 'fr',
		messages: {
			'group.lifecycle': { value: 'Cycle de vie' },
			'group.release': { value: 'Publication' },
			'option.draft': { value: 'Brouillon' },
			'option.legacy': { value: 'Ancien' },
			'option.published': { value: 'Publié' },
			'select.placeholder': { value: 'Choisir un statut' },
		},
	}),
]);

function WithTranslations({ children }: { children: ReactNode }) {
	return (
		<DesignSystemTranslationProvider
			resolver={createTranslationResolver({
				registry: translations,
				locale: 'fr',
				specKeys: ['design-system.select'],
			})}
		>
			{children}
		</DesignSystemTranslationProvider>
	);
}

const { Select: WebSelect } = await import('./Select');
const { Select: NativeSelect } = await import('./Select.native');

describe('grouped Select wrappers', () => {
	it('renders translated groups through the web Select wrapper', () => {
		const html = renderToStaticMarkup(
			<WithTranslations>
				<WebSelect
					placeholderI18n="select.placeholder"
					options={[{ labelI18n: 'option.legacy', value: 'legacy' }]}
					groups={[
						{
							labelI18n: 'group.lifecycle',
							options: [{ labelI18n: 'option.draft', value: 'draft' }],
						},
						{
							labelI18n: 'group.release',
							options: [{ labelI18n: 'option.published', value: 'published' }],
						},
					]}
				/>
			</WithTranslations>
		);

		expect(html).toContain('Choisir un statut');
		expect(html).toContain('Cycle de vie');
		expect(html).toContain('Publication');
		expect(html).toContain('Brouillon');
		expect(html).toContain('Publié');
		expect(html).not.toContain('Ancien');
	});

	it('resolves the selected label from grouped options on native', () => {
		const html = renderToStaticMarkup(
			<WithTranslations>
				<NativeSelect
					value="published"
					groups={[
						{
							labelI18n: 'group.lifecycle',
							options: [{ labelI18n: 'option.draft', value: 'draft' }],
						},
						{
							labelI18n: 'group.release',
							options: [{ labelI18n: 'option.published', value: 'published' }],
						},
					]}
				/>
			</WithTranslations>
		);

		expect(html).toContain('data-value="published"');
		expect(html).toContain('data-label="Publié"');
		expect(html).toContain('Cycle de vie');
		expect(html).toContain('Publication');
	});
});
