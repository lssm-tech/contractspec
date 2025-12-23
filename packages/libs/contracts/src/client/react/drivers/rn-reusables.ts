/**
 * React Native driver for FormSpec using @lssm/lib.ui-kit components.
 * Maps contract form slots to mobile UI-kit primitives.
 */
import type { DriverSlots } from '../form-render';

/**
 * Create a React Native UI-kit driver by mapping required slots to components.
 * Host apps should import their UI-kit primitives and pass them here.
 *
 * Example usage:
 * ```tsx
 * import { rnReusablesDriver } from '@lssm/lib.contracts/client/react/drivers/rn-reusables';
 * import { Input, Textarea, Button } from '@lssm/lib.ui-kit/ui';
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
