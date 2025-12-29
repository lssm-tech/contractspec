import type { HandlerCtx } from '../types';
import type { OperationSpec, OpKind } from '../operations/';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { ResourceRefDescriptor } from '../resources';

export type RuntimeContract = OperationSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;

export interface SpecVariantResolver {
  resolve(
    operation: { name: string; version: string; kind: OpKind },
    ctx: HandlerCtx
  ): Promise<RuntimeContract | undefined> | RuntimeContract | undefined;
}
