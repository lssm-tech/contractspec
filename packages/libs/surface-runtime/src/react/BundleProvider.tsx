'use client';

import React, { createContext, useContext } from 'react';
import type { ResolvedSurfacePlan } from '../runtime/resolve-bundle';
import type { PreferenceDimensions } from '../spec/types';

const BundlePlanContext = createContext<ResolvedSurfacePlan | null>(null);
const PreferencesContext = createContext<PreferenceDimensions | null>(null);

export interface BundleProviderProps {
  plan: ResolvedSurfacePlan;
  children: React.ReactNode;
  /** When true, enables customization mode (DnD, widget palette). */
  isEditing?: boolean;
}

/**
 * Provides the resolved surface plan and preferences to the component tree.
 * Must wrap BundleRenderer and any consumers of useBundlePlan / useBundlePreferences.
 */
const EditingContext = createContext<boolean>(false);

export function BundleProvider({
  plan,
  children,
  isEditing = false,
}: BundleProviderProps) {
  const preferences = plan.adaptation.appliedDimensions;
  return (
    <BundlePlanContext.Provider value={plan}>
      <PreferencesContext.Provider value={preferences}>
        <EditingContext.Provider value={isEditing}>
          {children}
        </EditingContext.Provider>
      </PreferencesContext.Provider>
    </BundlePlanContext.Provider>
  );
}

export function useIsEditing(): boolean {
  return useContext(EditingContext);
}

export function useBundlePlan(): ResolvedSurfacePlan {
  const value = useContext(BundlePlanContext);
  if (!value) {
    throw new Error('useBundlePlan must be used inside BundleProvider.');
  }
  return value;
}

export function useBundlePreferences(): PreferenceDimensions {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('useBundlePreferences must be used inside BundleProvider.');
  }
  return value;
}
