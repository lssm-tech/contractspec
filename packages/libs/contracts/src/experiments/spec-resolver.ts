import type { HandlerCtx } from '../types';
import type { OperationSpec, OpKind } from '../operation';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ResourceRefDescriptor } from '../resources';

export type RuntimeContract = OperationSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;

export interface SpecVariantResolver {
  resolve(
    operation: { name: string; version: number; kind: OpKind },
    ctx: HandlerCtx
  ): Promise<RuntimeContract | undefined> | RuntimeContract | undefined;
}
