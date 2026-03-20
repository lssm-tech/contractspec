import { View } from 'react-native';
import type { SkeletonCircleProps } from './types';

export function SkeletonCircle({
	size = 32,
	sizeClass,
	className,
}: SkeletonCircleProps) {
	if (sizeClass) {
		return (
			<View
				className={['rounded-full bg-muted', sizeClass, className]
					.filter(Boolean)
					.join(' ')}
			/>
		);
	}
	return (
		<View
			className={['rounded-full bg-muted', className].filter(Boolean).join(' ')}
			style={{ width: size, height: size }}
		/>
	);
}

export default SkeletonCircle;
