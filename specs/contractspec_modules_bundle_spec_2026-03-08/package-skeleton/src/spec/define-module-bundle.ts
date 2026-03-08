import type { ModuleBundleSpec } from "./types";

export function defineModuleBundle<const T extends ModuleBundleSpec>(spec: T): T {
  return spec;
}
