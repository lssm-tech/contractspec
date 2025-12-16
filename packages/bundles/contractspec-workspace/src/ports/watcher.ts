/**
 * File watcher adapter port.
 */

/**
 * Watcher event types.
 */
export type WatchEventType = 'add' | 'change' | 'unlink';

/**
 * Watcher event.
 */
export interface WatchEvent {
  type: WatchEventType;
  path: string;
}

/**
 * Watcher event handler.
 */
export type WatchEventHandler = (event: WatchEvent) => void | Promise<void>;

/**
 * Options for file watching.
 */
export interface WatchOptions {
  pattern: string;
  ignore?: string[];
  debounceMs?: number;
}

/**
 * Watcher instance.
 */
export interface Watcher {
  /**
   * Register event handler.
   */
  on(handler: WatchEventHandler): void;

  /**
   * Stop watching.
   */
  close(): Promise<void>;
}

/**
 * File watcher adapter interface.
 */
export interface WatcherAdapter {
  /**
   * Start watching files matching pattern.
   */
  watch(options: WatchOptions): Watcher;
}



