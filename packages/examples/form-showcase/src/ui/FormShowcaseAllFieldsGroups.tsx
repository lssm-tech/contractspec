'use client';

import { Input } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import {
	Choice,
	Field,
	Group,
	SelectPreview,
} from './FormShowcaseControlPrimitives';
import { allFieldsDefaultValues } from './form-showcase-preview.data';
import { contactRows } from './form-showcase-preview.model';

export function AddressGroup() {
	return (
		<Group title="Address field" className="lg:col-span-2">
			<Input
				defaultValue={allFieldsDefaultValues.mailingAddress.line1}
				aria-label="Address line 1"
			/>
			<Input
				defaultValue={allFieldsDefaultValues.mailingAddress.city}
				aria-label="City"
			/>
			<Input
				defaultValue={allFieldsDefaultValues.mailingAddress.postalCode}
				aria-label="Postal code"
			/>
			<SelectPreview
				id="country"
				value="France"
				options={['United States', 'United Kingdom']}
			/>
		</Group>
	);
}

export function ContactArray() {
	return (
		<VStack
			gap="sm"
			className="rounded-md border border-border bg-background p-3 lg:col-span-2"
		>
			<Text className="font-semibold text-sm">Array: contacts</Text>
			{contactRows.map((contact, index) => (
				<HStack
					key={contact.label}
					align="end"
					className="gap-2 md:flex-nowrap"
				>
					<Field id={`contact-label-${index}`} label="Label">
						<Input id={`contact-label-${index}`} defaultValue={contact.label} />
					</Field>
					<Field id={`contact-email-${index}`} label="Email">
						<Input
							id={`contact-email-${index}`}
							type="email"
							defaultValue={contact.value}
						/>
					</Field>
					<Choice
						type="checkbox"
						label="Preferred"
						defaultChecked={contact.preferred}
					/>
				</HStack>
			))}
		</VStack>
	);
}
