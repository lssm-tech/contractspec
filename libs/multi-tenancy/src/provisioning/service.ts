/* eslint-disable */

export interface TenantProvisioningConfig {
  db: any; // Prisma Client
}

export interface CreateTenantInput {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
}

export class TenantProvisioningService {
  constructor(private readonly config: TenantProvisioningConfig) {}

  async provision(input: CreateTenantInput) {
    const { db } = this.config;

    // Transactional provisioning
    return db.$transaction(async (tx: any) => {
      // 1. Create Tenant Record
      const tenant = await tx.tenant.create({
        data: {
          id: input.id,
          name: input.name,
          slug: input.slug,
          status: 'active',
        },
      });

      // 2. Create Owner User (if not exists)
      let user = await tx.user.findUnique({
        where: { email: input.ownerEmail },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: input.ownerEmail,
            name: input.ownerEmail.split('@')[0],
          },
        });
      }

      // 3. Assign Owner Role
      await tx.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: 'owner',
        },
      });

      // 4. Create Default Settings
      await tx.tenantSettings.create({
        data: {
          tenantId: tenant.id,
          theme: 'default',
          features: {},
        },
      });

      return tenant;
    });
  }
}
