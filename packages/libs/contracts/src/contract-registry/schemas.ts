import z from 'zod';
import type {
  ContractRegistryItem,
  ContractRegistryItemType,
  ContractRegistryManifest,
} from './types';
import { StabilityEnum } from '../ownership';

const ContractRegistryItemTypeValues = [
  'contractspec:operation',
  'contractspec:event',
  'contractspec:presentation',
  'contractspec:form',
  'contractspec:feature',
  'contractspec:workflow',
  'contractspec:template',
  'contractspec:integration',
  'contractspec:data-view',
] as const satisfies readonly ContractRegistryItemType[];

export const ContractRegistryItemTypeSchema = z.enum(
  ContractRegistryItemTypeValues
);

export const ContractRegistryFileSchema = z.object({
  path: z.string().min(1),
  type: z.string().min(1),
  content: z.string().optional(),
});

export const ContractRegistryItemSchema = z.object({
  name: z.string().min(1),
  type: ContractRegistryItemTypeSchema,
  version: z.number().int().nonnegative(),
  title: z.string().min(1),
  description: z.string().min(1),
  meta: z.object({
    stability: z.enum([
      StabilityEnum.Idea,
      StabilityEnum.InCreation,
      StabilityEnum.Experimental,
      StabilityEnum.Beta,
      StabilityEnum.Stable,
      StabilityEnum.Deprecated,
    ]),
    owners: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
  }),
  dependencies: z.array(z.string().min(1)).optional(),
  registryDependencies: z.array(z.string().min(1)).optional(),
  files: z.array(ContractRegistryFileSchema).min(1),
  schema: z
    .object({
      input: z.unknown().optional(),
      output: z.unknown().optional(),
    })
    .optional(),
});

export const ContractRegistryManifestSchema = z.object({
  $schema: z.string().min(1).optional(),
  name: z.string().min(1),
  homepage: z.string().min(1).optional(),
  items: z.array(ContractRegistryItemSchema),
});

export type ContractRegistryItemParsed = z.infer<
  typeof ContractRegistryItemSchema
> &
  ContractRegistryItem;

export type ContractRegistryManifestParsed = z.infer<
  typeof ContractRegistryManifestSchema
> &
  ContractRegistryManifest;
