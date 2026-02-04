import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const ContractPatchAddSchema = z.object({
  path: z.string().min(1),
  value: z.unknown(),
});

export const ContractPatchAddModel = new ZodSchemaType(ContractPatchAddSchema, {
  name: 'ContractPatchAdd',
});

export type ContractPatchAdd = z.infer<typeof ContractPatchAddSchema>;

const ContractPatchUpdateSchema = z.object({
  path: z.string().min(1),
  value: z.unknown(),
});

export const ContractPatchUpdateModel = new ZodSchemaType(
  ContractPatchUpdateSchema,
  {
    name: 'ContractPatchUpdate',
  }
);

export type ContractPatchUpdate = z.infer<typeof ContractPatchUpdateSchema>;

const ContractPatchRemoveSchema = z.object({
  path: z.string().min(1),
});

export const ContractPatchRemoveModel = new ZodSchemaType(
  ContractPatchRemoveSchema,
  {
    name: 'ContractPatchRemove',
  }
);

export type ContractPatchRemove = z.infer<typeof ContractPatchRemoveSchema>;

const ContractSpecOverlaySchema = z.object({
  adds: z.array(ContractPatchAddSchema).optional(),
  updates: z.array(ContractPatchUpdateSchema).optional(),
  removes: z.array(ContractPatchRemoveSchema).optional(),
});

export const ContractSpecOverlayModel = new ZodSchemaType(
  ContractSpecOverlaySchema,
  {
    name: 'ContractSpecOverlay',
  }
);

export type ContractSpecOverlay = z.infer<typeof ContractSpecOverlaySchema>;

const ContractSpecPatchSchema = z.object({
  overlay: ContractSpecOverlaySchema,
});

export const ContractSpecPatchModel = new ZodSchemaType(
  ContractSpecPatchSchema,
  {
    name: 'ContractSpecPatch',
  }
);

export type ContractSpecPatch = z.infer<typeof ContractSpecPatchSchema>;
