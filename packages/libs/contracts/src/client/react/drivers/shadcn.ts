import type { DriverSlots } from '../form-render';

/**
 * Create a shadcn/ui driver by mapping required slots to components.
 * Host apps should import their shadcn primitives and pass them here.
 */
export function shadcnDriver(slots: DriverSlots): DriverSlots {
  return slots;
}

export type ShadcnDriver = ReturnType<typeof shadcnDriver>;
