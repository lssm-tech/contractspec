import type { JSX } from 'react';
import * as React from 'react';

type VisuallyHiddenProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
};

const srOnlyStyle: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
};

const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as = 'span', style, children, ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp ref={ref} style={{ ...srOnlyStyle, ...style }} {...props}>
        {children}
      </Comp>
    );
  }
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
