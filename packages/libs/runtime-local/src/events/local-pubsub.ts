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
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const listeners = this.listeners.get(event)!;
    listeners.add(listener as Listener<unknown>);
    return () => {
      listeners.delete(listener as Listener<unknown>);
    };
  }
}







