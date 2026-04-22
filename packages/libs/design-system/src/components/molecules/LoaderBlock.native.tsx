import * as React from 'react';
import { Text, View } from 'react-native';
import { LoaderCircular } from '../atoms/LoaderCircular.native';

export interface LoaderBlockProps {
	label?: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function LoaderBlock({
	label,
	description,
	className,
	size = 'md',
}: LoaderBlockProps) {
	return (
		<View
			className={['items-center justify-center p-6', className]
				.filter(Boolean)
				.join(' ')}
		>
			<View className="flex-row items-center gap-3">
				<LoaderCircular size={size} label={label} />
				{description ? (
					<Text className="text-base text-muted-foreground">{description}</Text>
				) : null}
			</View>
		</View>
	);
}

export default LoaderBlock;
