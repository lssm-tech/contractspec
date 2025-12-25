import { decodeEvent, type EventBus } from './eventBus';
import type { EventSpec } from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';

/** Typed subscription using your EventSpec */
export async function subscribeEvent<T extends AnySchemaModel>(
  bus: EventBus,
  spec: EventSpec<T>,
  handler: (
    payload: T,
    ctx: { traceId?: string; deliveryId?: string }
  ) => Promise<void>
) {
  const topic = `${spec.meta.key}.v${spec.meta.version}`;
  return bus.subscribe(topic, async (u8) => {
    const env = decodeEvent<T>(u8);
    if (env.key !== spec.meta.key || env.version !== spec.meta.version) return;
    await handler(env.payload, { traceId: env.traceId, deliveryId: env.id });
  });
}
