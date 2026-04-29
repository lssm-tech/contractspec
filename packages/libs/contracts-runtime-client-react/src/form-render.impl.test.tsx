import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	defineFormSpec,
	RichFieldsShowcaseForm,
	responsiveFormColumns,
} from '@contractspec/lib.contracts-spec/forms';
import { fromZod } from '@contractspec/lib.schema';
import Window from 'happy-dom/lib/window/Window.js';
import type { ComponentProps } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { z } from 'zod';
import {
	createFormRenderer,
	type DriverSlots,
	filterAutocompleteOptions,
	mapAutocompleteValue,
} from './form-render.impl';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://contracts-runtime-client-react.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		HTMLElement: windowInstance.HTMLElement,
		HTMLInputElement: windowInstance.HTMLInputElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		AbortController:
			windowInstance.AbortController ?? globalThis.AbortController,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

const mockDriver: DriverSlots = {
	Field: ({ children, layout: _layout, ...props }) => (
		<div data-slot="field" {...props}>
			{children}
		</div>
	),
	FieldContent: ({ children, ...props }) => (
		<div data-slot="field-content" {...props}>
			{children}
		</div>
	),
	FieldLabel: ({ children, htmlFor }) => (
		<label htmlFor={htmlFor}>{children}</label>
	),
	FieldDescription: ({ children, ...props }) => <p {...props}>{children}</p>,
	FieldError: ({ errors, ...props }) => (
		<div role="alert" {...props}>
			{errors.map((error) => error.message).join(',')}
		</div>
	),
	FieldGroup: ({ children, layout: _layout, ...props }) => (
		<div data-slot="field-group" {...props}>
			{children}
		</div>
	),
	FieldSet: ({ children, ...props }) => (
		<fieldset data-slot="field-set" {...props}>
			{children}
		</fieldset>
	),
	FieldLegend: ({ children, variant }) => (
		<legend data-variant={variant}>{children}</legend>
	),
	Input: (props) => <input {...props} />,
	NumberField: (props) => <input data-slot="number-field" {...props} />,
	PercentField: ({ valueScale, ...props }) => (
		<input data-slot="percent-field" data-value-scale={valueScale} {...props} />
	),
	CurrencyField: ({ format: _format, ...props }) => (
		<input data-slot="currency-field" {...props} />
	),
	DurationField: ({ valueUnit, ...props }) => (
		<input data-slot="duration-field" data-value-unit={valueUnit} {...props} />
	),
	Textarea: (props) => <textarea {...props} />,
	InputGroup: ({ children }) => <div data-slot="input-group">{children}</div>,
	InputGroupAddon: ({ children, align }) => (
		<div data-slot="input-group-addon" data-align={align}>
			{children}
		</div>
	),
	InputGroupInput: (props) => (
		<input data-slot="input-group-control" {...props} />
	),
	InputGroupTextarea: (props) => (
		<textarea data-slot="input-group-control" {...props} />
	),
	InputGroupText: ({ children }) => <span>{children}</span>,
	InputGroupIcon: ({ iconKey, label }) => (
		<span data-icon={iconKey} aria-label={label} />
	),
	PasswordInput: ({
		passwordPurpose,
		visibilityToggle,
		showLabelI18n,
		hideLabelI18n,
		...props
	}) => (
		<input
			data-slot="password-input"
			data-password-purpose={passwordPurpose}
			data-visibility-toggle={String(visibilityToggle)}
			data-show-label={showLabelI18n}
			data-hide-label={hideLabelI18n}
			{...props}
		/>
	),
	Select: ({ options, value, onChange }) => (
		<select
			value={value == null ? '' : String(value)}
			onChange={(event) => onChange?.(event.currentTarget.value)}
		>
			{options.map((option) => (
				<option key={String(option.value)} value={String(option.value)}>
					{option.labelI18n}
				</option>
			))}
		</select>
	),
	Checkbox: ({ checked, onCheckedChange, ...props }) => (
		<input
			{...props}
			type="checkbox"
			checked={checked}
			onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
		/>
	),
	RadioGroup: ({ options, onValueChange, ...props }) => (
		<div {...props}>
			{options.map((option) => (
				<button
					key={String(option.value)}
					type="button"
					onClick={() => onValueChange?.(option.value)}
				>
					{option.labelI18n}
				</button>
			))}
		</div>
	),
	Switch: ({ checked, onCheckedChange, ...props }) => (
		<input
			{...props}
			type="checkbox"
			checked={checked}
			onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
		/>
	),
	Autocomplete: ({ options, selectedOptions }) => (
		<div data-widget="autocomplete">
			{selectedOptions.map((option) => option.labelI18n).join(',')}
			{options.map((option) => (
				<span key={String(option.value)}>{option.labelI18n}</span>
			))}
		</div>
	),
	AddressField: ({ value }) => (
		<div data-widget="address">{value?.line1 ?? 'address-empty'}</div>
	),
	PhoneField: ({ value }) => (
		<div data-widget="phone">{value?.countryCode ?? 'phone-empty'}</div>
	),
	DateField: ({ value, format }) => (
		<div data-format={format?.dateStyle} data-widget="date">
			{value ? value.toISOString() : 'date-empty'}
		</div>
	),
	TimeField: ({ value, format }) => (
		<div data-format={format?.timeStyle} data-widget="time">
			{value ? value.toISOString() : 'time-empty'}
		</div>
	),
	DateTimeField: ({ value, format }) => (
		<div data-format={format?.dateStyle} data-widget="datetime">
			{value ? value.toISOString() : 'datetime-empty'}
		</div>
	),
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
};

type AutocompleteDriverProps = ComponentProps<DriverSlots['Autocomplete']>;
type PhoneDriverProps = ComponentProps<DriverSlots['PhoneField']>;

function delay(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const LayoutForm = defineFormSpec({
	meta: {
		key: 'test.form.layout',
		version: '1.0.0',
		title: 'Layout Form',
		description: 'Exercises renderer layout hints.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			query: z.string().optional(),
			notes: z.string().optional(),
			enabled: z.boolean().optional(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			age: z.string().optional(),
		}),
		{ name: 'LayoutFormModel' }
	),
	layout: { columns: { base: 1, md: 4 }, gap: 'sm' },
	fields: [
		{
			kind: 'text',
			name: 'query',
			labelI18n: 'Search',
			descriptionI18n: 'Search by name or email.',
			layout: { colSpan: 'full' },
			inputGroup: {
				addons: [
					{
						align: 'inline-start',
						items: [
							{ kind: 'icon', iconKey: 'search', labelI18n: 'Search icon' },
						],
					},
					{
						align: 'inline-end',
						items: [{ kind: 'text', textI18n: '⌘K' }],
					},
				],
			},
		},
		{
			kind: 'textarea',
			name: 'notes',
			labelI18n: 'Notes',
			inputGroup: {
				addons: [
					{
						align: 'block-end',
						items: [{ kind: 'text', textI18n: 'Optional' }],
					},
				],
			},
		},
		{
			kind: 'switch',
			name: 'enabled',
			labelI18n: 'Enabled',
			descriptionI18n: 'Allow this form to be submitted.',
			layout: { orientation: 'horizontal', colSpan: 2 },
		},
		{
			kind: 'group',
			legendI18n: 'Profile',
			descriptionI18n: 'Personal details.',
			layout: { columns: 3, gap: 'md', colSpan: 'full' },
			fields: [
				{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
				{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
				{ kind: 'text', name: 'age', labelI18n: 'Age' },
			],
		},
	],
	actions: [{ key: 'submit', labelI18n: 'Submit' }],
});

const LegacyNumericLayoutForm = defineFormSpec({
	meta: {
		key: 'test.form.legacy-numeric-layout',
		version: '1.0.0',
		title: 'Legacy Numeric Layout Form',
		description: 'Exercises legacy numeric column rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
		}),
		{ name: 'LegacyNumericLayoutFormModel' }
	),
	layout: { columns: 2 },
	fields: [
		{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
		{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
	],
});

const MobileSafeLayoutForm = defineFormSpec({
	meta: {
		key: 'test.form.mobile-safe-layout',
		version: '1.0.0',
		title: 'Mobile Safe Layout Form',
		description: 'Exercises mobile-safe column helper rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
		}),
		{ name: 'MobileSafeLayoutFormModel' }
	),
	layout: { columns: responsiveFormColumns(2) },
	fields: [
		{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
		{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
	],
});

const SectionFlowForm = defineFormSpec({
	meta: {
		key: 'test.form.section-flow',
		version: '1.0.0',
		title: 'Section Flow Form',
		description: 'Exercises section flow rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			enabled: z.boolean().optional(),
			notes: z.string().optional(),
		}),
		{ name: 'SectionFlowFormModel' }
	),
	layout: {
		flow: {
			kind: 'sections',
			sections: [
				{
					key: 'profile',
					titleI18n: 'Profile',
					descriptionI18n: 'Name details.',
					fieldNames: ['firstName', 'lastName'],
					layout: { columns: responsiveFormColumns(2) },
				},
				{
					key: 'settings',
					titleI18n: 'Settings',
					fieldNames: ['enabled'],
				},
			],
		},
	},
	fields: [
		{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
		{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
		{ kind: 'switch', name: 'enabled', labelI18n: 'Enabled' },
		{ kind: 'textarea', name: 'notes', labelI18n: 'Notes' },
	],
});

const StepFlowForm = defineFormSpec({
	meta: {
		key: 'test.form.step-flow',
		version: '1.0.0',
		title: 'Step Flow Form',
		description: 'Exercises step flow rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
		}),
		{ name: 'StepFlowFormModel' }
	),
	layout: {
		flow: {
			kind: 'steps',
			previousLabelI18n: 'Back',
			nextLabelI18n: 'Continue',
			sections: [
				{
					key: 'first',
					titleI18n: 'First step',
					fieldNames: ['firstName'],
				},
				{
					key: 'second',
					titleI18n: 'Second step',
					fieldNames: ['lastName'],
				},
			],
		},
	},
	fields: [
		{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
		{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
	],
	actions: [{ key: 'submit', labelI18n: 'Submit' }],
});

const PasswordForm = defineFormSpec({
	meta: {
		key: 'test.form.password',
		version: '1.0.0',
		title: 'Password Form',
		description: 'Exercises password rendering hints.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			currentPassword: z.string().optional(),
			newPassword: z.string().optional(),
			legacyPassword: z.string().optional(),
		}),
		{ name: 'PasswordFormModel' }
	),
	fields: [
		{
			kind: 'text',
			name: 'currentPassword',
			labelI18n: 'Current password',
			password: { purpose: 'current' },
		},
		{
			kind: 'text',
			name: 'newPassword',
			labelI18n: 'New password',
			keyboard: { kind: 'new-password' },
			password: {
				purpose: 'new',
				visibilityToggle: false,
				showLabelI18n: 'Show new password',
				hideLabelI18n: 'Hide new password',
			},
		},
		{
			kind: 'text',
			name: 'legacyPassword',
			labelI18n: 'Legacy password',
			uiProps: { type: 'password', autoComplete: 'off' },
		},
	],
});

const EmailForm = defineFormSpec({
	meta: {
		key: 'test.form.email',
		version: '1.0.0',
		title: 'Email Form',
		description: 'Exercises first-class email rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			contactEmail: z.string().email().optional(),
		}),
		{ name: 'EmailFormModel' }
	),
	fields: [
		{
			kind: 'email',
			name: 'contactEmail',
			labelI18n: 'Contact email',
			descriptionI18n: 'Used for account notifications.',
			placeholderI18n: 'name@example.com',
			inputGroup: {
				addons: [
					{
						align: 'inline-start',
						items: [{ kind: 'icon', iconKey: 'mail', labelI18n: 'Email' }],
					},
				],
			},
		},
	],
});

const ResolverAutocompleteForm = defineFormSpec({
	meta: {
		key: 'test.form.resolver-autocomplete',
		version: '1.0.0',
		title: 'Resolver Autocomplete Form',
		description: 'Exercises resolver-backed autocomplete rendering.',
		domain: 'test',
		owners: ['@team.test'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			teamId: z.string(),
			reviewer: z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.optional(),
		}),
		{ name: 'ResolverAutocompleteFormModel' }
	),
	fields: [
		{
			kind: 'autocomplete',
			name: 'reviewer',
			labelI18n: 'Reviewer',
			source: {
				kind: 'resolver',
				resolverKey: 'reviewers',
				deps: ['teamId'],
				minQueryLength: 2,
				debounceMs: 0,
			},
			valueMapping: { mode: 'object' },
		},
	],
});

describe('contracts-runtime-client-react form renderer', () => {
	it('filters autocomplete options across configured search keys', () => {
		const options = [
			{
				labelI18n: 'Alice Martin',
				value: 'usr_1',
				descriptionI18n: 'Senior reviewer',
				data: { id: 'usr_1', email: 'alice@example.com' },
			},
			{
				labelI18n: 'Bob Chen',
				value: 'usr_2',
				data: { id: 'usr_2', email: 'bob@example.com' },
			},
		];

		const result = filterAutocompleteOptions(options, 'bob@example', ['email']);

		expect(result).toHaveLength(1);
		expect(result[0]?.labelI18n).toBe('Bob Chen');
		expect(filterAutocompleteOptions(options, 'senior', [])).toHaveLength(1);
		expect(filterAutocompleteOptions(options, 'usr_1', [])).toHaveLength(1);
	});

	it('maps autocomplete selections according to object and pick modes', () => {
		const option = {
			labelI18n: 'Alice Martin',
			value: 'usr_1',
			data: { id: 'usr_1', name: 'Alice Martin', email: 'alice@example.com' },
		};

		expect(mapAutocompleteValue(option, { mode: 'object' })).toEqual(
			option.data
		);
		expect(mapAutocompleteValue(option, { mode: 'scalar' })).toBe('usr_1');
		expect(
			mapAutocompleteValue(option, { mode: 'scalar', valueKey: 'email' })
		).toBe('alice@example.com');
		expect(
			mapAutocompleteValue(option, { mode: 'pick', pickKeys: ['id', 'email'] })
		).toEqual({
			id: 'usr_1',
			email: 'alice@example.com',
		});
	});

	it('keeps resolver-backed autocomplete state resilient across fetches', async () => {
		type ResolverCall = {
			args?: Record<string, unknown>;
			resolve: (value: readonly unknown[]) => void;
			reject: (error: unknown) => void;
		};
		const calls: ResolverCall[] = [];
		let latestAutocomplete: AutocompleteDriverProps | undefined;
		let root: Root | undefined;
		const renderer = createFormRenderer({
			driver: {
				...mockDriver,
				Autocomplete: (props) => {
					latestAutocomplete = props;
					return (
						<div
							data-widget="autocomplete"
							data-loading={props.loading || undefined}
							data-error={props.error ?? undefined}
						>
							{props.selectedOptions
								.map((option) => option.labelI18n)
								.join(',')}
							{props.options.map((option) => (
								<span key={String(option.value)}>{option.labelI18n}</span>
							))}
						</div>
					);
				},
			},
			resolvers: {
				reviewers: (_values, args) =>
					new Promise<readonly unknown[]>((resolve, reject) => {
						calls.push({ args, resolve, reject });
					}),
			},
		});
		const getLatest = () => {
			if (!latestAutocomplete) {
				throw new Error('Autocomplete did not render.');
			}
			return latestAutocomplete;
		};
		const flushAutocomplete = async () => {
			await act(async () => {
				await delay(20);
			});
		};

		const container = document.createElement('div');
		document.body.append(container);
		root = createRoot(container);

		await act(async () => {
			root?.render(
				renderer.render(ResolverAutocompleteForm, {
					defaultValues: { teamId: 'team_1' },
				})
			);
			await delay();
		});

		await act(async () => {
			getLatest().onQueryChange?.('a');
		});
		await flushAutocomplete();

		expect(calls).toHaveLength(0);
		expect(getLatest().loading).toBe(false);

		await act(async () => {
			getLatest().onQueryChange?.('al');
		});
		await flushAutocomplete();

		expect(calls).toHaveLength(1);
		expect(calls[0]?.args?.query).toBe('al');
		expect(calls[0]?.args?.fieldName).toBe('reviewer');
		expect(
			(calls[0]?.args?.deps as Record<string, unknown> | undefined)?.teamId
		).toBe('team_1');
		expect((calls[0]?.args?.signal as AbortSignal | undefined)?.aborted).toBe(
			false
		);
		expect(getLatest().loading).toBe(true);

		await act(async () => {
			getLatest().onQueryChange?.('ali');
		});
		await flushAutocomplete();

		expect(calls).toHaveLength(2);
		expect((calls[0]?.args?.signal as AbortSignal | undefined)?.aborted).toBe(
			true
		);
		expect(calls[1]?.args?.query).toBe('ali');

		await act(async () => {
			calls[1]?.resolve([
				{
					labelI18n: 'Alice Martin',
					value: 'usr_1',
					data: { id: 'usr_1', name: 'Alice Martin' },
				},
			]);
			await delay();
		});

		expect(getLatest().loading).toBe(false);
		expect(getLatest().options.map((option) => option.labelI18n)).toEqual([
			'Alice Martin',
		]);

		await act(async () => {
			calls[0]?.resolve([
				{
					labelI18n: 'Stale Reviewer',
					value: 'usr_stale',
					data: { id: 'usr_stale', name: 'Stale Reviewer' },
				},
			]);
			await delay();
		});

		expect(getLatest().options.map((option) => option.labelI18n)).toEqual([
			'Alice Martin',
		]);

		await act(async () => {
			const alice = getLatest().options[0];
			if (!alice) throw new Error('Expected Alice option.');
			getLatest().onSelectOption?.(alice);
			await delay();
		});

		expect(
			getLatest().selectedOptions.map((option) => option.labelI18n)
		).toEqual(['Alice Martin']);

		await act(async () => {
			getLatest().onQueryChange?.('bo');
		});
		await flushAutocomplete();

		expect(calls).toHaveLength(3);

		await act(async () => {
			calls[2]?.resolve([
				{
					labelI18n: 'Bob Chen',
					value: 'usr_2',
					data: { id: 'usr_2', name: 'Bob Chen' },
				},
			]);
			await delay();
		});

		expect(getLatest().options.map((option) => option.labelI18n)).toEqual([
			'Bob Chen',
		]);
		expect(
			getLatest().selectedOptions.map((option) => option.labelI18n)
		).toEqual(['Alice Martin']);

		await act(async () => {
			getLatest().onQueryChange?.('err');
		});
		await flushAutocomplete();
		await act(async () => {
			calls[3]?.reject(new Error('Reviewer lookup failed'));
			await delay();
		});

		expect(getLatest().loading).toBe(false);
		expect(getLatest().error).toBe('Reviewer lookup failed');

		await act(async () => {
			root?.unmount();
		});
	});

	it('writes linked split phone outputs from one phone field', async () => {
		const SplitPhoneForm = defineFormSpec({
			meta: {
				key: 'test.form.split-phone',
				version: '1.0.0',
				title: 'Split Phone Form',
				description: 'Exercises split phone output mapping.',
				domain: 'test',
				owners: ['@team.test'],
				tags: ['test'],
				stability: 'experimental',
			},
			model: fromZod(
				z.object({
					phoneNumber: z.string().optional(),
					phoneCountryCode: z.string().optional(),
					phoneCountryIso2: z.string().optional(),
					phoneE164: z.string().optional(),
				}),
				{ name: 'SplitPhoneModel' }
			),
			fields: [
				{
					kind: 'phone',
					name: 'phoneNumber',
					output: {
						mode: 'split',
						countryCodeFormat: 'iso2',
						countryCodeName: 'phoneCountryCode',
						countryIso2Name: 'phoneCountryIso2',
						e164Name: 'phoneE164',
					},
				},
			],
			actions: [{ key: 'submit', labelI18n: 'Submit' }],
		});
		let latestPhone: PhoneDriverProps | undefined;
		let submitted: Record<string, unknown> | undefined;
		const renderer = createFormRenderer({
			driver: {
				...mockDriver,
				PhoneField: (props) => {
					latestPhone = props;
					return <div data-widget="phone" />;
				},
			},
			submitMode: 'button',
			onSubmitOverride: (values) => {
				submitted = values as Record<string, unknown>;
			},
		});
		const container = document.createElement('div');
		document.body.append(container);
		const root = createRoot(container);

		await act(async () => {
			root.render(renderer.render(SplitPhoneForm));
			await delay();
		});
		await act(async () => {
			latestPhone?.onChange?.({
				countryCode: 'FR',
				countryIso2: 'FR',
				nationalNumber: '612345678',
				e164: '+33612345678',
			});
			await delay();
		});
		await act(async () => {
			container
				.querySelector('button')
				?.dispatchEvent(
					new window.MouseEvent('click', { bubbles: true, cancelable: true })
				);
			await delay();
		});

		expect(submitted?.phoneNumber).toBe('612345678');
		expect(submitted?.phoneCountryCode).toBe('FR');
		expect(submitted?.phoneCountryIso2).toBe('FR');
		expect(submitted?.phoneE164).toBe('+33612345678');
		await act(async () => {
			root.unmount();
		});
	});

	it('renders all rich field kinds with a compatible driver', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(
			renderer.render(RichFieldsShowcaseForm, {
				defaultValues: {
					recordId: 'rec_1',
					status: 'draft',
					reviewer: {
						id: 'usr_1',
						name: 'Alice Martin',
						email: 'alice@example.com',
					},
					contactEmail: 'support@example.com',
					address: {
						line1: '1 Main Street',
						city: 'Paris',
						countryCode: 'FR',
					},
					phone: {
						countryCode: '+33',
						nationalNumber: '612345678',
						e164: '+33612345678',
					},
					startDate: new Date('2026-04-10T00:00:00.000Z'),
					startTime: '09:30',
					publishedAt: new Date('2026-04-10T09:30:00.000Z'),
					budget: 1250,
					completionRatio: 0.42,
					allocation: 999.95,
					estimatedDuration: 90,
					contacts: [{ label: 'Support', value: 'support@example.com' }],
				},
			})
		);

		expect(html).toContain('Record ID');
		expect(html).toContain('data-widget="autocomplete"');
		expect(html).toContain('data-widget="address"');
		expect(html).toContain('data-widget="phone"');
		expect(html).toContain('name="contactEmail"');
		expect(html).toContain('type="email"');
		expect(html).toContain('data-widget="date"');
		expect(html).toContain('data-format="medium"');
		expect(html).toContain('data-widget="time"');
		expect(html).toContain('data-format="short"');
		expect(html).toContain('data-widget="datetime"');
		expect(html).toContain('data-slot="number-field"');
		expect(html).toContain('name="budget"');
		expect(html).toContain('value="1250"');
		expect(html).toContain('data-slot="percent-field"');
		expect(html).toContain('data-value-scale="fraction"');
		expect(html).toContain('value="42"');
		expect(html).toContain('data-slot="currency-field"');
		expect(html).toContain('data-slot="duration-field"');
		expect(html).toContain('data-value-unit="minute"');
	});

	it('renders layout hints, semantic groups, and input-group addons', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(LayoutForm));

		expect(html).toContain('data-slot="field-group"');
		expect(html).toContain('md:grid-cols-4');
		expect(html).toContain('grid-cols-3');
		expect(html).toContain('col-span-full');
		expect(html).toContain('col-span-2');
		expect(html).toContain('<fieldset');
		expect(html).toContain('<legend data-variant="legend">Profile</legend>');
		expect(html).toContain('data-slot="field-content"');
		expect(html).toContain('data-slot="input-group"');
		expect(html).toContain('data-align="inline-start"');
		expect(html).toContain('data-align="inline-end"');
		expect(html).toContain('data-align="block-end"');
		expect(html.indexOf('data-slot="input-group-control"')).toBeLessThan(
			html.indexOf('data-slot="input-group-addon"')
		);
		expect(html).toContain('aria-label="Search icon"');
		expect(html).toContain('aria-describedby="query-description"');
	});

	it('renders email fields with native email input behavior', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(EmailForm));

		expect(html).toContain('Contact email');
		expect(html).toContain('name="contactEmail"');
		expect(html).toContain('type="email"');
		expect(html).toContain('inputMode="email"');
		expect(html).toContain('autoComplete="email"');
		expect(html).toContain('autoCapitalize="none"');
		expect(html).toContain('autoCorrect="off"');
		expect(html).toContain('data-slot="input-group"');
		expect(html).toContain('aria-label="Email"');
		expect(html).toContain('aria-describedby="contactEmail-description"');
	});

	it('falls back to a plain input when email input-group slots are absent', () => {
		const {
			InputGroup: _InputGroup,
			InputGroupAddon: _InputGroupAddon,
			InputGroupInput: _InputGroupInput,
			...driverWithoutInputGroup
		} = mockDriver;
		const renderer = createFormRenderer({ driver: driverWithoutInputGroup });
		const html = renderToStaticMarkup(renderer.render(EmailForm));

		expect(html).toContain('name="contactEmail"');
		expect(html).toContain('type="email"');
		expect(html).toContain('autoComplete="email"');
		expect(html).not.toContain('data-slot="input-group"');
	});

	it('preserves legacy numeric columns and renders helper-authored mobile-safe columns', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const legacyHtml = renderToStaticMarkup(
			renderer.render(LegacyNumericLayoutForm)
		);
		const mobileSafeHtml = renderToStaticMarkup(
			renderer.render(MobileSafeLayoutForm)
		);

		expect(legacyHtml).toContain('grid-cols-2');
		expect(legacyHtml).not.toContain('md:grid-cols-2');
		expect(mobileSafeHtml).toContain('grid-cols-1');
		expect(mobileSafeHtml).toContain('md:grid-cols-2');
	});

	it('renders section flow without dropping unlisted fields', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(SectionFlowForm));

		expect(html).toContain('<legend data-variant="legend">Profile</legend>');
		expect(html).toContain('Name details.');
		expect(html).toContain('<legend data-variant="legend">Settings</legend>');
		expect(html).toContain('First name');
		expect(html).toContain('Last name');
		expect(html).toContain('Enabled');
		expect(html).toContain('Notes');
		expect(html).toContain('md:grid-cols-2');
	});

	it('renders step flow one section at a time with navigation controls', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(StepFlowForm));

		expect(html).toContain('data-slot="form-steps"');
		expect(html).toContain('First step');
		expect(html).toContain('Second step');
		expect(html).toContain('<legend data-variant="legend">First step</legend>');
		expect(html).toContain('First name');
		expect(html).not.toContain('Last name');
		expect(html).toContain('Back');
		expect(html).toContain('Continue');
		expect(html).not.toContain('Submit');
	});

	it('renders password fields through the driver password slot', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(PasswordForm));

		expect(html).toContain('data-slot="password-input"');
		expect(html).toContain('data-password-purpose="current"');
		expect(html).toContain('autoComplete="current-password"');
		expect(html).toContain('data-password-purpose="new"');
		expect(html).toContain('autoComplete="new-password"');
		expect(html).toContain('data-visibility-toggle="false"');
		expect(html).toContain('data-show-label="Show new password"');
		expect(html).toContain('name="legacyPassword"');
		expect(html).toContain('type="password"');
	});

	it('falls back to a masked input when no password driver slot is supplied', () => {
		const { PasswordInput: _PasswordInput, ...driverWithoutPassword } =
			mockDriver;
		const renderer = createFormRenderer({ driver: driverWithoutPassword });
		const html = renderToStaticMarkup(renderer.render(PasswordForm));

		expect(html).toContain('name="currentPassword"');
		expect(html).toContain('type="password"');
		expect(html).toContain('autoComplete="current-password"');
		expect(html).toContain('name="newPassword"');
		expect(html).toContain('autoComplete="new-password"');
		expect(html).not.toContain('type="text"');
	});

	it('renders invalid state and error ids when form errors are supplied', () => {
		const renderer = createFormRenderer({
			driver: mockDriver,
			formOptions: {
				errors: {
					query: { type: 'manual', message: 'Required' },
				},
			},
		});
		const html = renderToStaticMarkup(renderer.render(LayoutForm));

		expect(html).toContain('data-invalid="true"');
		expect(html).toContain('aria-invalid="true"');
		expect(html).toContain('query-error');
		expect(html).toContain('Required');
	});

	it('keeps native form semantics as the default submit mode', () => {
		const renderer = createFormRenderer({ driver: mockDriver });
		const html = renderToStaticMarkup(renderer.render(RichFieldsShowcaseForm));

		expect(html).toContain('<form');
		expect(html).toContain('type="submit"');
	});

	it('can render through host-provided form and action slots', () => {
		const renderer = createFormRenderer({
			driver: {
				...mockDriver,
				FormRoot: ({ children }) => (
					<section data-form-root="custom">{children}</section>
				),
				Actions: ({ children }) => (
					<nav data-form-actions="custom">{children}</nav>
				),
			},
			submitMode: 'button',
		});

		const html = renderToStaticMarkup(renderer.render(RichFieldsShowcaseForm));

		expect(html).toContain('data-form-root="custom"');
		expect(html).toContain('data-form-actions="custom"');
		expect(html).not.toContain('<form');
		expect(html).toContain('type="button"');
	});

	it('invokes submit override through button submit mode', async () => {
		let capturedSubmit: (() => void) | undefined;
		let submitted:
			| { actionKey: string; values: Record<string, unknown> }
			| undefined;
		const renderer = createFormRenderer({
			driver: {
				...mockDriver,
				Button: ({ children, onClick, type, ...props }) => {
					if (type === 'button' && onClick) {
						capturedSubmit = onClick;
					}
					return (
						<button type={type} {...props}>
							{children}
						</button>
					);
				},
			},
			submitMode: 'button',
			onSubmitOverride: (values, actionKey) => {
				submitted = {
					actionKey,
					values: values as Record<string, unknown>,
				};
			},
		});

		renderToStaticMarkup(
			renderer.render(RichFieldsShowcaseForm, {
				defaultValues: {
					recordId: 'rec_1',
					status: 'draft',
					reviewer: {
						id: 'usr_1',
						name: 'Alice Martin',
						email: 'alice@example.com',
					},
					contactEmail: 'support@example.com',
					address: {
						line1: '1 Main Street',
						city: 'Paris',
						countryCode: 'FR',
					},
					phone: {
						countryCode: '+33',
						nationalNumber: '612345678',
						e164: '+33612345678',
					},
					startDate: new Date('2026-04-10T00:00:00.000Z'),
					startTime: '09:30',
					publishedAt: new Date('2026-04-10T09:30:00.000Z'),
					budget: 1250,
					completionRatio: 0.42,
					allocation: 2500.5,
					estimatedDuration: 90,
					contacts: [{ label: 'Support', value: 'support@example.com' }],
				},
			})
		);

		expect(capturedSubmit).toBeDefined();
		capturedSubmit?.();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(submitted?.actionKey).toBe('submit');
		expect(submitted?.values.recordId).toBe('rec_1');
	});
});
