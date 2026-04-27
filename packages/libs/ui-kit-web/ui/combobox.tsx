'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface ComboboxOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
	keywords?: string[];
}

export interface ComboboxProps {
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	selectedValues?: string[];
	onRemoveValue?: (value: string) => void;
	query?: string;
	onQueryChange?: (query: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	loadingText?: string;
	errorText?: string;
	error?: string | null;
	loading?: boolean;
	multiple?: boolean;
	readOnly?: boolean;
	disabled?: boolean;
	id?: string;
	name?: string;
	'aria-invalid'?: boolean;
	'aria-describedby'?: string;
	className?: string;
}

function optionValue(option: ComboboxOption) {
	return String(option.value);
}

function nextEnabledIndex(
	options: readonly ComboboxOption[],
	currentIndex: number,
	direction: 1 | -1
) {
	if (!options.length) return -1;
	for (let offset = 1; offset <= options.length; offset += 1) {
		const candidate =
			(currentIndex + direction * offset + options.length) % options.length;
		if (!options[candidate]?.disabled) return candidate;
	}
	return -1;
}

export function Combobox({
	options,
	value,
	onValueChange,
	selectedValues,
	onRemoveValue,
	query,
	onQueryChange,
	placeholder = 'Select option',
	searchPlaceholder = 'Search option...',
	emptyText = 'No option found.',
	loadingText = 'Loading options...',
	errorText = 'Unable to load options.',
	error,
	loading,
	multiple,
	readOnly,
	disabled,
	id,
	name,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
	className,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(-1);
	const generatedId = React.useId().replace(/:/g, '');
	const inputId = id ?? `combobox-${generatedId}`;
	const listboxId = `${inputId}-listbox`;
	const selectedOption = options.find((option) => option.value === value);
	const selectedValueSet = new Set(
		selectedValues ?? (value ? [String(value)] : [])
	);
	const inputValue =
		query !== undefined && query.length > 0
			? query
			: (selectedOption?.label ?? '');
	const autocompleteMode =
		query !== undefined ||
		onQueryChange !== undefined ||
		multiple !== undefined ||
		selectedValues !== undefined ||
		onRemoveValue !== undefined ||
		loading !== undefined ||
		error !== undefined;

	const openAutocomplete = () => {
		if (disabled || readOnly) return;
		setOpen(true);
		setActiveIndex((current) =>
			current >= 0 ? current : nextEnabledIndex(options, -1, 1)
		);
	};

	const selectOption = (option: ComboboxOption) => {
		if (disabled || readOnly || option.disabled) return;
		onValueChange?.(optionValue(option));
		if (!multiple) {
			setOpen(false);
		}
	};

	if (autocompleteMode) {
		const activeOption = options[activeIndex];
		const statusText = loading
			? loadingText
			: error
				? (error ?? errorText)
				: emptyText;

		return (
			<div className={cn('relative w-full min-w-0 space-y-2', className)}>
				<input
					id={inputId}
					name={name}
					type="text"
					role="combobox"
					aria-autocomplete="list"
					aria-controls={listboxId}
					aria-expanded={open}
					aria-activedescendant={
						open && activeOption
							? `${listboxId}-${optionValue(activeOption)}`
							: undefined
					}
					aria-invalid={ariaInvalid}
					aria-describedby={ariaDescribedBy}
					value={inputValue}
					placeholder={searchPlaceholder ?? placeholder}
					readOnly={readOnly}
					disabled={disabled}
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-hidden ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					onFocus={openAutocomplete}
					onBlur={() => {
						globalThis.setTimeout(() => setOpen(false), 0);
					}}
					onChange={(event) => {
						onQueryChange?.(event.currentTarget.value);
						openAutocomplete();
						setActiveIndex(nextEnabledIndex(options, -1, 1));
					}}
					onKeyDown={(event) => {
						if (event.key === 'Escape') {
							setOpen(false);
							return;
						}
						if (event.key === 'ArrowDown') {
							event.preventDefault();
							setOpen(true);
							setActiveIndex((current) =>
								nextEnabledIndex(options, current, 1)
							);
							return;
						}
						if (event.key === 'ArrowUp') {
							event.preventDefault();
							setOpen(true);
							setActiveIndex((current) =>
								nextEnabledIndex(
									options,
									current < 0 ? options.length : current,
									-1
								)
							);
							return;
						}
						if (event.key === 'Enter' && open && activeOption) {
							event.preventDefault();
							selectOption(activeOption);
						}
					}}
				/>
				{open ? (
					<div
						id={listboxId}
						role="listbox"
						aria-busy={loading || undefined}
						aria-multiselectable={multiple || undefined}
						className="z-50 max-h-[300px] w-full overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
					>
						{options.length && !loading && !error ? (
							options.map((option, index) => {
								const key = optionValue(option);
								const selected = selectedValueSet.has(key);
								return (
									<div
										key={key}
										id={`${listboxId}-${key}`}
										role="option"
										aria-selected={selected}
										aria-disabled={option.disabled || undefined}
										data-active={activeIndex === index || undefined}
										data-selected={selected || undefined}
										className={cn(
											'flex cursor-default select-none items-start gap-2 rounded-xs px-2 py-1.5 text-sm outline-hidden',
											'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
											option.disabled && 'pointer-events-none opacity-50'
										)}
										onMouseDown={(event) => event.preventDefault()}
										onMouseEnter={() => setActiveIndex(index)}
										onClick={() => selectOption(option)}
									>
										<Check
											className={cn(
												'mt-0.5 size-4 shrink-0',
												selected ? 'opacity-100' : 'opacity-0'
											)}
										/>
										<span className="min-w-0">
											<span className="block truncate">{option.label}</span>
											{option.description ? (
												<span className="block truncate text-muted-foreground text-xs">
													{option.description}
												</span>
											) : null}
										</span>
									</div>
								);
							})
						) : (
							<div className="px-2 py-6 text-center text-muted-foreground text-sm">
								{statusText}
							</div>
						)}
					</div>
				) : null}
				{multiple && selectedValues?.length ? (
					<div className="flex flex-wrap gap-2">
						{selectedValues.map((selectedValue) => {
							const option = options.find(
								(candidate) => optionValue(candidate) === selectedValue
							);
							return (
								<button
									key={`selected-${selectedValue}`}
									type="button"
									className="inline-flex h-8 max-w-full items-center rounded-md border border-input px-2 text-sm disabled:opacity-50"
									aria-label={`Remove ${option?.label ?? selectedValue}`}
									disabled={disabled || readOnly}
									onClick={() => onRemoveValue?.(selectedValue)}
								>
									<span className="truncate">
										{option?.label ?? selectedValue}
									</span>
									<X className="ml-1 size-3 shrink-0" aria-hidden="true" />
								</button>
							);
						})}
					</div>
				) : null}
			</div>
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn('w-full justify-between', className)}
				>
					<span className={cn(!selectedOption && 'text-muted-foreground')}>
						{selectedOption?.label ?? placeholder}
					</span>
					<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={[
										option.value,
										option.label,
										...(option.keywords ?? []),
									].join(' ')}
									disabled={option.disabled}
									onSelect={() => {
										onValueChange?.(option.value);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 size-4',
											value === option.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
