type Listener<TPayload> = (payload: TPayload) => void;

export class LocalEventBus {
  private listeners = new Map<string, Set<Listener<unknown>>>();

  emit<TPayload = unknown>(event: string, payload: TPayload): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(payload);
    }
  }

  subscribe<TPayload = unknown>(
    event: string,
    listener: Listener<TPayload>
  ): () => void {
    let listeners = this.listeners.get(event);
    if (!listeners) {
      listeners = new Set();
      this.listeners.set(event, listeners);
    }
    listeners.add(listener as Listener<unknown>);
    return () => {
      listeners.delete(listener as Listener<unknown>);
    };
  }
}
