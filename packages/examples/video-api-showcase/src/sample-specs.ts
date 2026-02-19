// ---------------------------------------------------------------------------
// Sample Contract Spec Definitions for API Video Generation
// ---------------------------------------------------------------------------

/**
 * Spec metadata used to build API overview videos.
 * Maps directly to ApiOverviewProps.
 */
export interface ApiSpecDefinition {
  /** Contract spec name (e.g., "CreateUser") */
  specName: string;
  /** HTTP method */
  method: string;
  /** Endpoint path */
  endpoint: string;
  /** Contract spec code snippet */
  specCode: string;
  /** Generated output surfaces */
  generatedOutputs: string[];
}

/**
 * CreateUser -- user registration endpoint.
 */
export const createUserSpec: ApiSpecDefinition = {
  specName: 'CreateUser',
  method: 'POST',
  endpoint: '/api/users',
  specCode: `export const createUser = defineCommand({
  meta: {
    name: "CreateUser",
    version: "1.0.0",
    stability: "Stable",
  },
  io: {
    input: z.object({
      email: z.string().email(),
      name: z.string(),
      role: z.enum(["admin", "user"]),
    }),
    output: z.object({
      id: z.string().uuid(),
      email: z.string(),
      createdAt: z.date(),
    }),
  },
});`,
  generatedOutputs: [
    'REST Endpoint',
    'GraphQL Mutation',
    'Prisma Model',
    'TypeScript SDK',
    'MCP Tool',
    'OpenAPI Spec',
  ],
};

/**
 * ListTransactions -- financial transaction listing.
 */
export const listTransactionsSpec: ApiSpecDefinition = {
  specName: 'ListTransactions',
  method: 'GET',
  endpoint: '/api/transactions',
  specCode: `export const listTransactions = defineQuery({
  meta: {
    name: "ListTransactions",
    version: "1.0.0",
    stability: "Stable",
  },
  io: {
    input: z.object({
      accountId: z.string().uuid(),
      from: z.date().optional(),
      to: z.date().optional(),
      limit: z.number().default(50),
    }),
    output: z.object({
      transactions: z.array(transactionSchema),
      total: z.number(),
      hasMore: z.boolean(),
    }),
  },
});`,
  generatedOutputs: [
    'REST Endpoint',
    'GraphQL Query',
    'Prisma Query',
    'TypeScript SDK',
    'OpenAPI Spec',
  ],
};

/**
 * SendNotification -- push notification dispatch.
 */
export const sendNotificationSpec: ApiSpecDefinition = {
  specName: 'SendNotification',
  method: 'POST',
  endpoint: '/api/notifications',
  specCode: `export const sendNotification = defineCommand({
  meta: {
    name: "SendNotification",
    version: "1.0.0",
    stability: "Beta",
  },
  io: {
    input: z.object({
      userId: z.string().uuid(),
      channel: z.enum(["push", "email", "sms"]),
      title: z.string(),
      body: z.string(),
    }),
    output: z.object({
      notificationId: z.string().uuid(),
      deliveredAt: z.date().nullable(),
      status: z.enum(["sent", "failed", "queued"]),
    }),
  },
});`,
  generatedOutputs: [
    'REST Endpoint',
    'GraphQL Mutation',
    'TypeScript SDK',
    'MCP Tool',
    'OpenAPI Spec',
    'Event Schema',
  ],
};
