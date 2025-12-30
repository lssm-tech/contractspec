/**
 * React Native driver for FormSpec using @contractspec/lib.ui-kit components.
 * Maps contract form slots to mobile UI-kit primitives.
 */
import type { DriverSlots } from '../form-render';

/**
 * Create a React Native UI-kit driver by mapping required slots to components.
 * Host apps should import their UI-kit primitives and pass them here.
 *
 * Example usage:
 * ```tsx
 * import { rnReusablesDriver } from '@contractspec/lib.contracts/client/react/drivers/rn-reusables';
 * import { Input, Textarea, Button } from '@contractspec/lib.ui-kit/ui';
 *
 * const driver = rnReusablesDriver({
 *   Input, Textarea, Button, // ... other components
 * });
 * ```
 */
export function rnReusablesDriver(slots: DriverSlots): DriverSlots {
  return slots;
}

export type RnReusablesDriver = ReturnType<typeof rnReusablesDriver>;
