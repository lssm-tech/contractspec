'use client';

import * as React from 'react';

export type LiveRegionPoliteness = 'polite' | 'assertive';

interface LiveRegionMessage {
  id: number;
  text: string;
  politeness: LiveRegionPoliteness;
}

interface SRLiveRegionContextValue {
  announce: (text: string, politeness?: LiveRegionPoliteness) => void;
}

const SRLiveRegionContext =
  React.createContext<SRLiveRegionContextValue | null>(null);

export function useSRLiveRegion() {
  const ctx = React.useContext(SRLiveRegionContext);
  if (!ctx)
    throw new Error('useSRLiveRegion must be used within SRLiveRegionProvider');
  return ctx;
}

export function SRLiveRegionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = React.useState<LiveRegionMessage[]>([]);
  const idRef = React.useRef(0);

  const announce = React.useCallback(
    (text: string, politeness: LiveRegionPoliteness = 'polite') => {
      const id = ++idRef.current;
      setMessages((prev) => [...prev, { id, text, politeness }]);
      // Remove message after render tick to avoid accumulation
      setTimeout(
        () => setMessages((prev) => prev.filter((m) => m.id !== id)),
        1000
      );
    },
    []
  );

  return (
    <SRLiveRegionContext.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {messages
          .filter((m) => m.politeness === 'polite')
          .map((m) => (
            <div key={m.id}>{m.text}</div>
          ))}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {messages
          .filter((m) => m.politeness === 'assertive')
          .map((m) => (
            <div key={m.id}>{m.text}</div>
          ))}
      </div>
    </SRLiveRegionContext.Provider>
  );
}
