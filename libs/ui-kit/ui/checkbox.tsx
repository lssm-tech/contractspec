import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Check } from 'lucide-react-native';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'web:peer border-primary web:ring-offset-background web:focus-visible:outline-hidden web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 h-4 w-4 shrink-0 rounded-xs border disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
