import { describe, expect, it } from 'bun:test';
import { RichFieldsShowcaseForm } from '@contractspec/lib.contracts-spec/forms';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createFormRenderer,
	type DriverSlots,
	filterAutocompleteOptions,
	mapAutocompleteValue,
} from './form-render.impl';

const mockDriver: DriverSlots = {
	Field: ({ children }) => <div>{children}</div>,
	FieldLabel: ({ children, htmlFor }) => (
		<label htmlFor={htmlFor}>{children}</label>
	),
	FieldDescription: ({ children }) => <p>{children}</p>,
	FieldError: ({ errors }) => (
		<div>{errors.map((error) => error.message).join(',')}</div>
	),
	Input: (props) => <input {...props} />,
	Textarea: (props) => <textarea {...props} />,
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
	Checkbox: ({ checked, onCheckedChange }) => (
		<input
			type="checkbox"
			checked={checked}
			onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
		/>
	),
	RadioGroup: ({ options, onValueChange }) => (
		<div>
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
	Switch: ({ checked, onCheckedChange }) => (
		<input
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
	DateField: ({ value }) => (
		<div data-widget="date">{value ? value.toISOString() : 'date-empty'}</div>
	),
	TimeField: ({ value }) => (
		<div data-widget="time">{value ? value.toISOString() : 'time-empty'}</div>
	),
	DateTimeField: ({ value }) => (
		<div data-widget="datetime">
			{value ? value.toISOString() : 'datetime-empty'}
		</div>
	),
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
};

describe('contracts-runtime-client-react form renderer', () => {
	it('filters autocomplete options across configured search keys', () => {
		const options = [
			{
				labelI18n: 'Alice Martin',
				value: 'usr_1',
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
		expect(
			mapAutocompleteValue(option, { mode: 'pick', pickKeys: ['id', 'email'] })
		).toEqual({
			id: 'usr_1',
			email: 'alice@example.com',
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
					contacts: [{ label: 'Support', value: 'support@example.com' }],
				},
			})
		);

		expect(html).toContain('Record ID');
		expect(html).toContain('data-widget="autocomplete"');
		expect(html).toContain('data-widget="address"');
		expect(html).toContain('data-widget="phone"');
		expect(html).toContain('data-widget="date"');
		expect(html).toContain('data-widget="time"');
		expect(html).toContain('data-widget="datetime"');
	});
});
