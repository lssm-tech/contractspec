/**
 * Node.js file watcher adapter implementation using chokidar.
 */

import chokidar from 'chokidar';
import type {
  WatcherAdapter,
  WatchOptions,
  Watcher,
  WatchEventHandler,
  WatchEvent,
} from '../ports/watcher';

const DEFAULT_IGNORES = ['node_modules/**', 'dist/**', '.turbo/**'];

/**
 * Create a Node.js file watcher adapter using chokidar.
 */
export function createNodeWatcherAdapter(cwd?: string): WatcherAdapter {
  const baseCwd = cwd ?? process.cwd();

  return {
    watch(options: WatchOptions): Watcher {
      const handlers: WatchEventHandler[] = [];
      let debounceTimer: NodeJS.Timeout | undefined;

      const watcher = chokidar.watch(options.pattern, {
        cwd: baseCwd,
        ignored: options.ignore ?? DEFAULT_IGNORES,
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 250,
          pollInterval: 50,
        },
      });

      const emitEvent = (event: WatchEvent) => {
        if (options.debounceMs && options.debounceMs > 0) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            handlers.forEach((handler) => handler(event));
          }, options.debounceMs);
        } else {
          handlers.forEach((handler) => handler(event));
        }
      };

      watcher.on('add', (path) => {
        emitEvent({ type: 'add', path });
      });

      watcher.on('change', (path) => {
        emitEvent({ type: 'change', path });
      });

      watcher.on('unlink', (path) => {
        emitEvent({ type: 'unlink', path });
      });

      return {
        on(handler: WatchEventHandler): void {
          handlers.push(handler);
        },

        async close(): Promise<void> {
          clearTimeout(debounceTimer);
          await watcher.close();
        },
      };
    },
  };
}

