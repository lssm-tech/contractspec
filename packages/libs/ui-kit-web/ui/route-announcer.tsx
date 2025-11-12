'use client';

import * as React from 'react';

export function RouteAnnouncer({ title }: { title?: string }) {
  // When title changes, announce it in polite region
  const [message, setMessage] = React.useState('');
  React.useEffect(() => {
    if (title) setMessage(title);
  }, [title]);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
