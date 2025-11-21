import type { DeploymentEvent, DeploymentEventListener } from './types';

export class DeploymentEventBus {
  private listeners = new Set<DeploymentEventListener>();

  on(listener: DeploymentEventListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: DeploymentEvent) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('[progressive-delivery] listener error', error);
      }
    }
  }
}
