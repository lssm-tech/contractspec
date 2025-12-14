'use client';

import * as React from 'react';

export interface SelectedStudioProject {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

const SelectedProjectContext = React.createContext<SelectedStudioProject | null>(
  null
);

export function SelectedProjectProvider({
  project,
  children,
}: {
  project: SelectedStudioProject;
  children: React.ReactNode;
}) {
  return (
    <SelectedProjectContext.Provider value={project}>
      {children}
    </SelectedProjectContext.Provider>
  );
}

export function useSelectedProject() {
  const value = React.useContext(SelectedProjectContext);
  if (!value) {
    throw new Error('useSelectedProject must be used within SelectedProjectProvider');
  }
  return value;
}


