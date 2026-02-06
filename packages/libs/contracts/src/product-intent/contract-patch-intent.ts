import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const PatchChangeTypeSchema = z.enum([
  'add_field',
  'remove_field',
  'rename_field',
  'add_event',
  'update_event',
  'add_operation',
  'update_operation',
  'update_form',
  'update_policy',
  'add_enum_value',
  'remove_enum_value',
  'other',
]);

export type PatchChangeType = z.infer<typeof PatchChangeTypeSchema>;

const PatchChangeSchema = z.object({
  type: PatchChangeTypeSchema,
  target: z.string().min(1),
  detail: z.string().min(1),
});

export const PatchChangeModel = new ZodSchemaType(PatchChangeSchema, {
  name: 'PatchChange',
});

export type PatchChange = z.infer<typeof PatchChangeSchema>;

const ContractPatchIntentSchema = z.object({
  featureKey: z.string().min(1),
  changes: z.array(PatchChangeSchema),
  acceptanceCriteria: z.array(z.string().min(1)),
});

export const ContractPatchIntentModel = new ZodSchemaType(
  ContractPatchIntentSchema,
  {
    name: 'ContractPatchIntent',
  }
);

export type ContractPatchIntent = z.infer<typeof ContractPatchIntentSchema>;
