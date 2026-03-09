import React, { createContext, useContext } from "react";
import type { ResolvedSurfacePlan } from "../runtime/resolve-bundle";

const BundlePlanContext = createContext<ResolvedSurfacePlan | null>(null);

export function BundleProvider(props: {
  plan: ResolvedSurfacePlan;
  children: React.ReactNode;
}) {
  return (
    <BundlePlanContext.Provider value={props.plan}>
      {props.children}
    </BundlePlanContext.Provider>
  );
}

export function useBundlePlan() {
  const value = useContext(BundlePlanContext);
  if (!value) {
    throw new Error("useBundlePlan must be used inside BundleProvider.");
  }
  return value;
}
