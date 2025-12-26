import type { AnySchemaModel } from '@lssm/lib.schema';

/** In-memory registry for PresentationSpec. */
export class ModelRegistry {
  private items = new Map<string, AnySchemaModel>();

  protected constructor(items?: AnySchemaModel[]) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: AnySchemaModel): this {
    if (this.items.has(p.config.name))
      throw new Error(`Duplicate contract \`model\` ${p.config.name}`);
    this.items.set(p.config.name, p);
    return this;
  }

  list(): AnySchemaModel[] {
    return [...this.items.values()];
  }

  get(name: string): AnySchemaModel | undefined {
    return this.items.get(name);
  }
}
