import * as React from 'react';

export function FocusOnRouteChange({
  focusSelector = 'h1, [data-page-title], #main',
}: {
  focusSelector?: string;
}) {
  React.useEffect(() => {
    const el = document.querySelector<HTMLElement>(focusSelector);
    if (el) {
      el.tabIndex = -1;
      el.focus();
    }
  });
  return null;
}
