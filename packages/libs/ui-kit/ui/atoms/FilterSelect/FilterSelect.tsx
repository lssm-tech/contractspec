import React from 'react';
import { View } from 'react-native';
import { Label } from '../../label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../select';
import { HStack } from '../../stack';
import { Text } from '../../text';
import type { FilterSelectProps } from './types';

export const FilterSelect: React.FC<FilterSelectProps> = ({
	value,
	options,
	onChange,
	placeholder = 'Sélectionner...',
	label,
	disabled = false,
	className = '',
	showCounts = false,
}) => {
	return (
		<HStack className={`space-y-2 ${className}`}>
			{label && (
				<Label className="font-medium text-base text-foreground">{label}</Label>
			)}
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="bg-background">
					{/* All/Reset option */}
					<SelectItem value="all" label="Tous">
						<Text>Tous</Text>
						{showCounts && (
							<View className="ml-2 text-muted-foreground text-sm">
								({options.reduce((sum, option) => sum + (option.count || 0), 0)}
								)
							</View>
						)}
					</SelectItem>

					{/* Filter options */}
					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							label={option.label}
						>
							<HStack className="flex w-full items-center justify-between">
								<Text>{option.label}</Text>
								{showCounts && option.count !== undefined && (
									<Text className="ml-2 text-muted-foreground text-sm">
										({option.count})
									</Text>
								)}
							</HStack>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</HStack>
	);
};
