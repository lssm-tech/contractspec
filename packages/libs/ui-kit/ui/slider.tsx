import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as SliderPrimitive from '@rn-primitives/slider';
import * as React from 'react';

type SliderProps = SliderPrimitive.RootProps & {
	ref?: React.RefObject<SliderPrimitive.RootRef>;
};

function Slider({ className, ...props }: SliderProps) {
	return (
		<SliderPrimitive.Root
			className={cn(
				'relative flex w-full flex-row items-center data-[disabled]:opacity-50',
				className
			)}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
				<SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className="ml-[-8] h-4 w-4 rounded-full border border-primary bg-background" />
		</SliderPrimitive.Root>
	);
}

export { Slider };
