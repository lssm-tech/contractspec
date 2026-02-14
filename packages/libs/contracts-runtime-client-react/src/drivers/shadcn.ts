import type { DriverSlots } from '../form-render';

export function shadcnDriver(slots: DriverSlots): DriverSlots {
  return slots;
}

export type ShadcnDriver = ReturnType<typeof shadcnDriver>;
