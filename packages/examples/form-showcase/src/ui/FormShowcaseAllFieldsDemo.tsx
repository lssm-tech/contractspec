'use client';

import { Input, Textarea } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { ActionButton } from './FormShowcaseActionButton';
import { AddressGroup, ContactArray } from './FormShowcaseAllFieldsGroups';
import {
	Choice,
	Field,
	Group,
	SelectPreview,
	SwitchPreview,
} from './FormShowcaseControlPrimitives';
import { allFieldsDefaultValues } from './form-showcase-preview.data';

export function AllFieldsDemoForm() {
	return (
		<VStack
			role="form"
			aria-label="All field kinds demo"
			className="grid gap-4 lg:grid-cols-2"
		>
			<Field id="fullName" label="Text" kind="Full name">
				<Input id="fullName" defaultValue={allFieldsDefaultValues.fullName} />
			</Field>
			<Field id="email" label="Email" kind="Autocomplete email">
				<Input
					id="email"
					type="email"
					defaultValue={allFieldsDefaultValues.email}
				/>
			</Field>
			<Field id="username" label="Input group" kind="Prefix + text">
				<HStack gap="none" wrap="nowrap">
					<Text className="flex h-9 items-center rounded-l-md border border-input border-r-0 bg-muted px-3 text-muted-foreground text-sm">
						@
					</Text>
					<Input
						id="username"
						defaultValue={allFieldsDefaultValues.username}
						className="rounded-l-none"
					/>
				</HStack>
			</Field>
			<Field id="role" label="Select" kind="Static options">
				<SelectPreview id="role" value="Admin" options={['Editor', 'Viewer']} />
			</Field>
			<Field
				id="bio"
				label="Textarea"
				kind="Full-width content"
				className="lg:col-span-2"
			>
				<Textarea id="bio" rows={3} defaultValue={allFieldsDefaultValues.bio} />
			</Field>
			<Group title="Password group" className="lg:col-span-2">
				<Field id="currentPassword" label="Current password" kind="Masked">
					<Input
						id="currentPassword"
						type="password"
						defaultValue={allFieldsDefaultValues.currentPassword}
					/>
				</Field>
				<Field id="newPassword" label="New password" kind="Visibility-ready">
					<Input
						id="newPassword"
						type="password"
						defaultValue={allFieldsDefaultValues.newPassword}
					/>
				</Field>
			</Group>
			<Field id="contactPreference" label="Radio" kind="Preferred contact">
				<HStack gap="sm" wrap="wrap">
					<Choice
						type="radio"
						name="contactPreference"
						label="Email"
						defaultChecked
					/>
					<Choice type="radio" name="contactPreference" label="Phone" />
					<Choice type="radio" name="contactPreference" label="SMS" />
				</HStack>
			</Field>
			<VStack
				gap="sm"
				className="rounded-md border border-border bg-background p-3"
			>
				<Choice type="checkbox" label="Accept terms" defaultChecked />
				<Choice
					type="checkbox"
					label="Marketing updates when terms accepted"
					defaultChecked
				/>
				<SwitchPreview label="Switch: marketing opt-in" checked />
			</VStack>
			<Field id="reviewer" label="Autocomplete" kind="Local reviewer source">
				<Input
					id="reviewer"
					defaultValue={allFieldsDefaultValues.reviewer.name}
				/>
			</Field>
			<Field id="phone" label="Phone" kind="Country + number">
				<HStack gap="xs" wrap="nowrap">
					<SelectPreview
						id="phoneCountry"
						value="+33"
						options={['+1', '+44']}
					/>
					<Input
						id="phone"
						defaultValue={allFieldsDefaultValues.phone.nationalNumber}
					/>
				</HStack>
			</Field>
			<AddressGroup />
			<Field id="birthDate" label="Date" kind="Native date">
				<Input id="birthDate" type="date" defaultValue="1992-04-15" />
			</Field>
			<Field id="reminderTime" label="Time" kind="24-hour time">
				<Input
					id="reminderTime"
					type="time"
					defaultValue={allFieldsDefaultValues.reminderTime}
				/>
			</Field>
			<Field id="launchWindow" label="Datetime" kind="Conditional on role">
				<Input
					id="launchWindow"
					type="datetime-local"
					defaultValue="2026-05-12T10:00"
				/>
			</Field>
			<Field id="recordId" label="Read-only computed" kind="Session value">
				<Input
					id="recordId"
					readOnly
					defaultValue={allFieldsDefaultValues.recordId}
				/>
			</Field>
			<ContactArray />
			<HStack gap="sm" className="lg:col-span-2">
				<ActionButton variant="primary" label="Save form" />
				<ActionButton label="Validate draft" />
			</HStack>
		</VStack>
	);
}
