import type { AnySchemaModel } from '@lssm/lib.schema';
import { isSchemaModel } from '@lssm/lib.schema';

/**
 * Get a name for any schema model type.
 * For SchemaModel, uses config.name. For other SchemaType, generates a default.
 */
function getModelName(model: AnySchemaModel): string {
  if (isSchemaModel(model)) {
    return model.config.name;
  }
  // For non-SchemaModel types, use a hash or default name
  return 'AnonymousSchema_' + Math.random().toString(36).substring(7);
}

/** In-memory registry for SchemaModel and SchemaType instances. */
export class ModelRegistry {
  private items = new Map<string, AnySchemaModel>();

  public constructor(items?: AnySchemaModel[]) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: AnySchemaModel): this {
    const name = getModelName(p);
    if (this.items.has(name))
      throw new Error(`Duplicate contract \`model\` ${name}`);
    this.items.set(name, p);
    return this;
  }

  list(): AnySchemaModel[] {
    return [...this.items.values()];
  }

  get(name: string): AnySchemaModel | undefined {
    return this.items.get(name);
  }
}
