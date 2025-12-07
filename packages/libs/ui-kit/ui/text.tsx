import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '@lssm/lib.ui-kit-core/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

export type TextProps = React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<React.ComponentRef<typeof RNText>>;
  asChild?: boolean;
};

function Text({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<React.ComponentRef<typeof RNText>>;
  asChild?: boolean;
}) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        'text-foreground web:select-text text-base',
        textClass,
        className
      )}
      {...props}
    />
  );
}

export { Text, TextClassContext };
