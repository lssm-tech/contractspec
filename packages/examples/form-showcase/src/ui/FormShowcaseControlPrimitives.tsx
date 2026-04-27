'use client';

import { Input } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';

export function Field({
	id,
	label,
	kind,
	children,
	className,
}: {
	id: string;
	label: string;
	kind?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<VStack gap="xs" className={className}>
			<Text className="font-semibold text-sm">{label}</Text>
			{kind ? (
				<Text className="text-muted-foreground text-xs">{kind}</Text>
			) : null}
			{children}
		</VStack>
	);
}

export function Group({
	title,
	children,
	className,
}: {
	title: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<VStack
			gap="md"
			role="group"
			aria-label={title}
			className={`rounded-md border border-border bg-background p-3 ${className ?? ''}`}
		>
			<Text className="font-semibold text-sm">{title}</Text>
			<Box
				align="stretch"
				justify="start"
				className="grid gap-3 md:grid-cols-2"
			>
				{children}
			</Box>
		</VStack>
	);
}

export function Choice({
	type,
	label,
	name,
	defaultChecked = false,
}: {
	type: 'checkbox' | 'radio';
	label: string;
	name?: string;
	defaultChecked?: boolean;
}) {
	return (
		<HStack gap="sm" align="center" wrap="nowrap">
			<Input
				type={type}
				name={name}
				aria-label={label}
				defaultChecked={defaultChecked}
				className="size-4 min-w-4 accent-primary shadow-none"
			/>
			<Text className="text-sm">{label}</Text>
		</HStack>
	);
}

export function SwitchPreview({
	label,
	checked = false,
}: {
	label: string;
	checked?: boolean;
}) {
	return (
		<HStack gap="sm" align="center" wrap="nowrap">
			<Input
				type="checkbox"
				role="switch"
				aria-label={label}
				defaultChecked={checked}
				className="sr-only"
			/>
			<Box
				className={`h-5 w-9 rounded-full p-0.5 ring-1 ring-border ${checked ? 'bg-primary' : 'bg-muted'}`}
			>
				<Box
					className={`size-4 rounded-full bg-background shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
				/>
			</Box>
			<Text className="text-sm">{label}</Text>
		</HStack>
	);
}

export function SelectPreview({
	id,
	value,
	options,
}: {
	id: string;
	value: string;
	options: readonly string[];
}) {
	return (
		<VStack gap="xs">
			<HStack
				id={id}
				role="combobox"
				aria-expanded="false"
				aria-label={`${id} select`}
				justify="between"
				wrap="nowrap"
				className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs"
			>
				<Text className="text-sm">{value}</Text>
				<Text className="text-muted-foreground text-xs">v</Text>
			</HStack>
			<HStack gap="xs" wrap="wrap">
				{options.map((option) => (
					<Text
						key={option}
						className="rounded-full bg-muted px-2 py-0.5 text-xs"
					>
						{option}
					</Text>
				))}
			</HStack>
		</VStack>
	);
}
