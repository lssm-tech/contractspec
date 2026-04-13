'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';

type ChartTheme = {
	light?: string;
	dark?: string;
};

export type ChartConfig = Record<
	string,
	{
		label?: React.ReactNode;
		icon?: React.ComponentType<{ className?: string }>;
		color?: string;
		theme?: ChartTheme;
	}
>;

type ChartPayloadItem = {
	name?: string;
	dataKey?: string;
	value?: React.ReactNode;
	color?: string;
	payload?: Record<string, unknown>;
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function getConfigEntry(config: ChartConfig, key?: string) {
	return key ? config[key] : undefined;
}

function getChartVariables(config: ChartConfig): React.CSSProperties {
	return Object.entries(config).reduce<Record<string, string>>(
		(styles, [key, value]) => {
			if (value.color) {
				styles[`--color-${key}`] = value.color;
			}
			if (value.theme?.light) {
				styles[`--color-${key}-light`] = value.theme.light;
			}
			if (value.theme?.dark) {
				styles[`--color-${key}-dark`] = value.theme.dark;
			}
			return styles;
		},
		{}
	) as React.CSSProperties;
}

export interface ChartContainerProps
	extends React.ComponentPropsWithoutRef<'div'> {
	config: ChartConfig;
}

export function ChartContainer({
	config,
	className,
	style,
	...props
}: ChartContainerProps) {
	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-slot="chart"
				className={cn('flex aspect-video justify-center text-xs', className)}
				style={{ ...getChartVariables(config), ...style }}
				{...props}
			/>
		</ChartContext.Provider>
	);
}

export function useChart() {
	const context = React.useContext(ChartContext);
	if (!context) {
		throw new Error('useChart must be used within a ChartContainer.');
	}
	return context;
}

export function ChartTooltip(props: React.ComponentPropsWithoutRef<'div'>) {
	return <div data-slot="chart-tooltip" {...props} />;
}

export interface ChartTooltipContentProps
	extends React.ComponentPropsWithoutRef<'div'> {
	label?: React.ReactNode;
	payload?: ChartPayloadItem[];
	hideLabel?: boolean;
	hideIndicator?: boolean;
	labelKey?: string;
	nameKey?: string;
	indicator?: 'line' | 'dot';
}

export function ChartTooltipContent({
	className,
	label,
	payload,
	hideLabel,
	hideIndicator,
	labelKey,
	nameKey,
	indicator = 'dot',
	...props
}: ChartTooltipContentProps) {
	const { config } = useChart();

	if (!payload?.length) {
		return null;
	}

	return (
		<div
			data-slot="chart-tooltip-content"
			className={cn(
				'grid min-w-40 gap-2 rounded-lg border bg-background p-2 shadow-md',
				className
			)}
			{...props}
		>
			{!hideLabel && label ? (
				<div className="font-medium">
					{labelKey
						? (getConfigEntry(config, labelKey)?.label ?? label)
						: label}
				</div>
			) : null}
			<div className="grid gap-1">
				{payload.map((item, index) => {
					const key = String(item.dataKey ?? item.name ?? index);
					const entry = getConfigEntry(config, item.dataKey ?? item.name);
					return (
						<div key={key} className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								{!hideIndicator ? (
									<span
										className={cn(
											'shrink-0 rounded-full',
											indicator === 'line' ? 'h-2.5 w-5' : 'size-2.5'
										)}
										style={{ backgroundColor: item.color ?? entry?.color }}
									/>
								) : null}
								<span className="text-muted-foreground">
									{nameKey
										? (getConfigEntry(config, nameKey)?.label ?? item.name)
										: (entry?.label ?? item.name)}
								</span>
							</div>
							<span className="font-medium">{item.value}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function ChartLegend(props: React.ComponentPropsWithoutRef<'div'>) {
	return <div data-slot="chart-legend" {...props} />;
}

export interface ChartLegendContentProps
	extends React.ComponentPropsWithoutRef<'div'> {
	payload?: ChartPayloadItem[];
	nameKey?: string;
}

export function ChartLegendContent({
	className,
	payload,
	nameKey,
	...props
}: ChartLegendContentProps) {
	const { config } = useChart();

	if (!payload?.length) {
		return null;
	}

	return (
		<div
			data-slot="chart-legend-content"
			className={cn('flex flex-wrap items-center gap-4', className)}
			{...props}
		>
			{payload.map((item, index) => {
				const key = String(item.dataKey ?? item.name ?? index);
				const entry = getConfigEntry(config, item.dataKey ?? item.name);
				return (
					<div key={key} className="flex items-center gap-2">
						<span
							className="size-2.5 rounded-full"
							style={{ backgroundColor: item.color ?? entry?.color }}
						/>
						<span className="text-muted-foreground text-sm">
							{nameKey
								? (getConfigEntry(config, nameKey)?.label ?? item.name)
								: (entry?.label ?? item.name)}
						</span>
					</div>
				);
			})}
		</div>
	);
}
