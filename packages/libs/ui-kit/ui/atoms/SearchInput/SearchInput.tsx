import { Search, X } from 'lucide-react';
import React from 'react';
import { View } from 'react-native';
import { Button } from '../../button';
import { Input } from '../../input';
import { Text } from '../../text';
import type { SearchInputProps } from './types';

export const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChange,
	placeholder = 'Rechercher...',
	onClear,
	disabled = false,
	className = '',
}) => {
	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	return (
		<View className={`relative w-full ${className}`}>
			<View className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search className="h-4 w-4 text-muted-foreground" />
			</View>

			<Input
				// type="text"
				value={value}
				onChange={(e) => onChange(e.nativeEvent.text)}
				placeholder={placeholder}
				editable={!disabled}
				className="pr-10 pl-10"
			/>

			{value && (
				<View className="absolute inset-y-0 right-0 flex items-center pr-3">
					<Button
						// type="button"
						variant="ghost"
						size="sm"
						onPress={handleClear}
						disabled={disabled}
						className="h-6 w-6 p-0 hover:bg-transparent"
					>
						<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
						<Text className="sr-only">Effacer la recherche</Text>
					</Button>
				</View>
			)}
		</View>
	);
};
