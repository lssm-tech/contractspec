export interface ElysiaServerOptions {
  logger: any;
  plugins?: any[];
  mount?: any[];
  port?: number;
}

export function createStritElysiaServer(opts: ElysiaServerOptions) {
  opts.logger?.warn?.(
    '[contractspec-studio] Elysia server scaffolding is not bundled in this package.'
  );
  return {
    use() {
      return this;
    },
    get() {
      return this;
    },
  };
}
