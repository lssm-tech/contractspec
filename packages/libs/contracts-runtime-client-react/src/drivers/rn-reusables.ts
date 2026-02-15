import type { DriverSlots } from '../form-render';

export function rnReusablesDriver(slots: DriverSlots): DriverSlots {
  return slots;
}

export type RnReusablesDriver = ReturnType<typeof rnReusablesDriver>;
