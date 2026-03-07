export class AsyncEventQueue<T> implements AsyncIterable<T> {
  private readonly values: T[] = [];
  private readonly waiters: ((value: IteratorResult<T>) => void)[] = [];
  private done = false;

  push(value: T): void {
    if (this.done) {
      return;
    }

    const waiter = this.waiters.shift();
    if (waiter) {
      waiter({ value, done: false });
      return;
    }
    this.values.push(value);
  }

  close(): void {
    if (this.done) {
      return;
    }

    this.done = true;
    for (const waiter of this.waiters) {
      waiter({ value: undefined as never, done: true });
    }
    this.waiters.length = 0;
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: async (): Promise<IteratorResult<T>> => {
        const value = this.values.shift();
        if (value != null) {
          return { value, done: false };
        }

        if (this.done) {
          return { value: undefined as never, done: true };
        }

        return new Promise<IteratorResult<T>>((resolve) => {
          this.waiters.push(resolve);
        });
      },
    };
  }
}
