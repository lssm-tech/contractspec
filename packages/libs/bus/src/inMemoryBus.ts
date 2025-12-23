import type { EventKey } from '@lssm/lib.contracts';
import type { EventBus } from './eventBus';

/**
 * In-memory bus for dev/test. Not for production scale.
 * Subscribers receive events synchronously in the order they were published.
 */
export class InMemoryBus implements EventBus {
  private listeners = new Map<
    string,
    Set<(payload: Uint8Array) => Promise<void>>
  >();

  async publish(topic: EventKey, payload: Uint8Array): Promise<void> {
    const handlers = this.listeners.get(topic);
    if (!handlers) return;
    await Promise.all([...handlers].map((h) => h(payload)));
  }

  async subscribe(
    topic: string | RegExp,
    handler: (payload: Uint8Array) => Promise<void>
  ): Promise<() => Promise<void>> {
    const topicStr = String(topic);
    let set = this.listeners.get(topicStr);
    if (!set) {
      set = new Set();
      this.listeners.set(topicStr, set);
    }
    set.add(handler);
    return async () => {
      set?.delete(handler);
    };
  }
}
