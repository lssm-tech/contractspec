export class IsolationValidator {
  /**
   * Validates that a Prisma query arguments object includes the correct tenantId.
   * Useful for unit tests and audit logs.
   */
  static validateQuery(
    model: string,
    action: string,
    args: any,
    expectedTenantId: string
  ): boolean {
    if (!expectedTenantId) return true; // No isolation required if no tenant context

    // Skip actions that don't touch data or are global
    if (['count', 'aggregate'].includes(action) && !args.where) return true;

    // Create
    if (action === 'create') {
      return args.data?.tenantId === expectedTenantId;
    }
    if (action === 'createMany') {
      return (
        Array.isArray(args.data) &&
        args.data.every((item: any) => item.tenantId === expectedTenantId)
      );
    }

    // Read / Update / Delete
    if (args.where) {
      // Check exact match
      if (args.where.tenantId === expectedTenantId) return true;

      // Check AND clauses
      if (args.where.AND) {
        const ands = Array.isArray(args.where.AND)
          ? args.where.AND
          : [args.where.AND];
        return ands.some((cond: any) => cond.tenantId === expectedTenantId);
      }
    }

    return false;
  }
}







