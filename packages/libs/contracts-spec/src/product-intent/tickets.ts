import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';

const TicketPrioritySchema = z.enum(['low', 'medium', 'high']);
export type TicketPriority = z.infer<typeof TicketPrioritySchema>;

const TicketSchema = z.object({
  ticketId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1),
  acceptanceCriteria: z.array(z.string().min(1)).min(1),
  priority: TicketPrioritySchema.optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export const TicketModel = new ZodSchemaType(TicketSchema, {
  name: 'Ticket',
});

export type Ticket = z.infer<typeof TicketSchema>;

const TicketCollectionSchema = z.object({
  tickets: z.array(TicketSchema),
});

export const TicketCollectionModel = new ZodSchemaType(TicketCollectionSchema, {
  name: 'TicketCollection',
});

export type TicketCollection = z.infer<typeof TicketCollectionSchema>;
