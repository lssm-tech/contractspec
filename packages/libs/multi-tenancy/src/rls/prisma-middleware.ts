export type TenantIdProvider = () =>
  | string
  | undefined
  | Promise<string | undefined>;

export function createRlsMiddleware(getTenantId: TenantIdProvider) {
  return async (params: any, next: (params: any) => Promise<any>) => {
    const tenantId = await getTenantId();

    // Skip if no tenant context (e.g., system background job)
    if (!tenantId) {
      return next(params);
    }

    const { model, action, args } = params;

    // TODO: Check if model actually has tenantId field (requires DMMF or config)
    // For now, we assume all models accessed within tenant context have tenantId
    // or the database will throw an error which is safe (deny by default-ish).

    if (
      action === 'findUnique' ||
      action === 'findFirst' ||
      action === 'findMany' ||
      action === 'update' ||
      action === 'updateMany' ||
      action === 'delete' ||
      action === 'deleteMany' ||
      action === 'count' ||
      action === 'aggregate' ||
      action === 'groupBy'
    ) {
      // Convert findUnique to findFirst to allow adding tenantId to where clause
      if (
        action === 'findUnique' ||
        action === 'delete' ||
        action === 'update'
      ) {
        params.action =
          action === 'findUnique'
            ? 'findFirst'
            : action === 'delete'
              ? 'deleteMany'
              : 'updateMany';
      }

      if (!args.where) {
        params.args.where = { tenantId };
      } else if (args.where.tenantId === undefined) {
        params.args.where = { ...args.where, tenantId };
      }
    } else if (action === 'create') {
      if (!args.data.tenantId) {
        params.args.data.tenantId = tenantId;
      }
    } else if (action === 'createMany') {
      if (Array.isArray(args.data)) {
        params.args.data = args.data.map((item: any) => ({
          ...item,
          tenantId,
        }));
      }
    }

    return next(params);
  };
}




