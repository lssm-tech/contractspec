import * as SeparatorPrimitive from '@rn-primitives/separator';
import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorPrimitive.RootProps & {
  ref?: React.RefObject<SeparatorPrimitive.RootRef>;
}) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
