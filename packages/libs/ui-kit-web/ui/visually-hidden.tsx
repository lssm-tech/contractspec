import type { JSX } from 'react';
import * as React from 'react';

type VisuallyHiddenProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  ref?: React.Ref<HTMLElement>;
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

function VisuallyHidden({
  as = 'span',
  style,
  children,
  ref,
  ...props
}: VisuallyHiddenProps) {
  const Comp = as as React.ElementType;
  return (
    <Comp ref={ref} style={{ ...srOnlyStyle, ...style }} {...props}>
      {children}
    </Comp>
  );
}

export { VisuallyHidden };
