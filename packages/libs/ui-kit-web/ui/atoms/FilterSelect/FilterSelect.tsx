import React from 'react';
import { Label } from '../../label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../select';
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
		<div className={`space-y-2 ${className}`}>
			{label && (
				<Label className="font-medium text-base text-foreground">{label}</Label>
			)}
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="bg-background">
					{/* All/Reset option */}
					<SelectItem value="all">
						Tous
						{showCounts && (
							<span className="ml-2 text-muted-foreground text-sm">
								({options.reduce((sum, option) => sum + (option.count || 0), 0)}
								)
							</span>
						)}
					</SelectItem>

					{/* Filter options */}
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<div className="flex w-full items-center justify-between">
								<span>{option.label}</span>
								{showCounts && option.count !== undefined && (
									<span className="ml-2 text-muted-foreground text-sm">
										({option.count})
									</span>
								)}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
