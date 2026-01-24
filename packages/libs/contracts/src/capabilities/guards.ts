/**
 * Capability guards for runtime enforcement.
 *
 * Provides utilities to assert that operations/events/presentations
 * have their required capabilities enabled before execution.
 *
 * @module capabilities/guards
 *
 * @example
 * ```typescript
 * import { assertCapabilityForOperation } from '@contractspec/lib.contracts';
 *
 * // In a handler or middleware
 * assertCapabilityForOperation(ctx, operation);
 * ```
 */

import type { CapabilityContext } from './context';
import { CapabilityMissingError } from './context';
import type { AnyOperationSpec } from '../operations/operation';
import type { AnyEventSpec } from '../events';
import type { PresentationSpec } from '../presentations/presentations';

// ─────────────────────────────────────────────────────────────────────────────
// Guard Types
// ─────────────────────────────────────────────────────────────────────────────

/** Result of a capability guard check. */
export interface CapabilityGuardResult {
  /** Whether the guard passed. */
  allowed: boolean;
  /** Missing capability if guard failed. */
  missingCapability?: { key: string; version: string };
  /** Reason for denial if guard failed. */
  reason?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guard Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if an operation's capability is enabled in the context.
 *
 * @param ctx - Capability context to check against
 * @param operation - Operation spec to check
 * @returns Guard result indicating if operation is allowed
 *
 * @example
 * ```typescript
 * const result = checkCapabilityForOperation(ctx, myOperation);
 * if (!result.allowed) {
 *   console.log('Denied:', result.reason);
 * }
 * ```
 */
export function checkCapabilityForOperation(
  ctx: CapabilityContext,
  operation: AnyOperationSpec
): CapabilityGuardResult {
  if (!operation.capability) {
    // No capability requirement, allow by default
    return { allowed: true };
  }

  const { key, version } = operation.capability;
  if (ctx.hasCapability(key, version)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    missingCapability: { key, version },
    reason: `Operation "${operation.meta.key}" requires capability "${key}.v${version}"`,
  };
}

/**
 * Assert that an operation's capability is enabled, throwing if not.
 *
 * @param ctx - Capability context to check against
 * @param operation - Operation spec to check
 * @throws {CapabilityMissingError} If capability is not enabled
 *
 * @example
 * ```typescript
 * // Throws if capability missing
 * assertCapabilityForOperation(ctx, myOperation);
 *
 * // Safe to proceed with operation
 * await handler(input);
 * ```
 */
export function assertCapabilityForOperation(
  ctx: CapabilityContext,
  operation: AnyOperationSpec
): void {
  const result = checkCapabilityForOperation(ctx, operation);
  if (!result.allowed && result.missingCapability) {
    throw new CapabilityMissingError(
      result.missingCapability.key,
      result.missingCapability.version
    );
  }
}

/**
 * Check if an event's capability is enabled in the context.
 *
 * @param ctx - Capability context to check against
 * @param event - Event spec to check
 * @returns Guard result indicating if event is allowed
 */
export function checkCapabilityForEvent(
  ctx: CapabilityContext,
  event: AnyEventSpec
): CapabilityGuardResult {
  if (!event.capability) {
    return { allowed: true };
  }

  const { key, version } = event.capability;
  if (ctx.hasCapability(key, version)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    missingCapability: { key, version },
    reason: `Event "${event.meta.key}" requires capability "${key}.v${version}"`,
  };
}

/**
 * Assert that an event's capability is enabled, throwing if not.
 *
 * @param ctx - Capability context to check against
 * @param event - Event spec to check
 * @throws {CapabilityMissingError} If capability is not enabled
 */
export function assertCapabilityForEvent(
  ctx: CapabilityContext,
  event: AnyEventSpec
): void {
  const result = checkCapabilityForEvent(ctx, event);
  if (!result.allowed && result.missingCapability) {
    throw new CapabilityMissingError(
      result.missingCapability.key,
      result.missingCapability.version
    );
  }
}

/**
 * Check if a presentation's capability is enabled in the context.
 *
 * @param ctx - Capability context to check against
 * @param presentation - Presentation spec to check
 * @returns Guard result indicating if presentation is allowed
 */
export function checkCapabilityForPresentation(
  ctx: CapabilityContext,
  presentation: PresentationSpec
): CapabilityGuardResult {
  if (!presentation.capability) {
    return { allowed: true };
  }

  const { key, version } = presentation.capability;
  if (ctx.hasCapability(key, version)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    missingCapability: { key, version },
    reason: `Presentation "${presentation.meta.key}" requires capability "${key}.v${version}"`,
  };
}

/**
 * Assert that a presentation's capability is enabled, throwing if not.
 *
 * @param ctx - Capability context to check against
 * @param presentation - Presentation spec to check
 * @throws {CapabilityMissingError} If capability is not enabled
 */
export function assertCapabilityForPresentation(
  ctx: CapabilityContext,
  presentation: PresentationSpec
): void {
  const result = checkCapabilityForPresentation(ctx, presentation);
  if (!result.allowed && result.missingCapability) {
    throw new CapabilityMissingError(
      result.missingCapability.key,
      result.missingCapability.version
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter operations to only those with enabled capabilities.
 *
 * @param ctx - Capability context to check against
 * @param operations - Operations to filter
 * @returns Operations that have their capabilities enabled (or no capability requirement)
 */
export function filterOperationsByCapability(
  ctx: CapabilityContext,
  operations: AnyOperationSpec[]
): AnyOperationSpec[] {
  return operations.filter(
    (op) => checkCapabilityForOperation(ctx, op).allowed
  );
}

/**
 * Filter events to only those with enabled capabilities.
 *
 * @param ctx - Capability context to check against
 * @param events - Events to filter
 * @returns Events that have their capabilities enabled (or no capability requirement)
 */
export function filterEventsByCapability(
  ctx: CapabilityContext,
  events: AnyEventSpec[]
): AnyEventSpec[] {
  return events.filter((ev) => checkCapabilityForEvent(ctx, ev).allowed);
}

/**
 * Filter presentations to only those with enabled capabilities.
 *
 * @param ctx - Capability context to check against
 * @param presentations - Presentations to filter
 * @returns Presentations that have their capabilities enabled (or no capability requirement)
 */
export function filterPresentationsByCapability(
  ctx: CapabilityContext,
  presentations: PresentationSpec[]
): PresentationSpec[] {
  return presentations.filter(
    (pres) => checkCapabilityForPresentation(ctx, pres).allowed
  );
}
