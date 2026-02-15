import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const WireframeDeviceSchema = z.enum(['mobile', 'desktop']);
export type WireframeDevice = z.infer<typeof WireframeDeviceSchema>;

const WireframeElementTypeSchema = z.enum([
  'header',
  'text',
  'input',
  'button',
  'list',
  'card',
  'divider',
  'progress',
]);

export type WireframeElementType = z.infer<typeof WireframeElementTypeSchema>;

const UiWireframeRequestSchema = z.object({
  screenName: z.string().min(1),
  device: WireframeDeviceSchema,
  currentScreenSummary: z.string().min(1),
  proposedChanges: z.array(z.string().min(1)),
});

export const UiWireframeRequestModel = new ZodSchemaType(
  UiWireframeRequestSchema,
  {
    name: 'UiWireframeRequest',
  }
);

export type UiWireframeRequest = z.infer<typeof UiWireframeRequestSchema>;

const UiWireframeElementSchema = z.object({
  type: WireframeElementTypeSchema,
  label: z.string().min(1),
  notes: z.string().min(1).optional(),
});

export const UiWireframeElementModel = new ZodSchemaType(
  UiWireframeElementSchema,
  {
    name: 'UiWireframeElement',
  }
);

export type UiWireframeElement = z.infer<typeof UiWireframeElementSchema>;

const UiWireframeLayoutSchema = z.object({
  layout: z.array(UiWireframeElementSchema),
});

export const UiWireframeLayoutModel = new ZodSchemaType(
  UiWireframeLayoutSchema,
  {
    name: 'UiWireframeLayout',
  }
);

export type UiWireframeLayout = z.infer<typeof UiWireframeLayoutSchema>;
