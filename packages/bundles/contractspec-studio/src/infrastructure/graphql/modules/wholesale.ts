import { gqlSchemaBuilder } from '../builder';
import { prisma } from '@lssm/app.cli-database-strit';
import { requireSellerOrgId } from '../guards';

export function registerWholesaleSchema() {
  // Types
  gqlSchemaBuilder.prismaObject('WholesaleProduct', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name'),
      sku: t.exposeString('sku'),
      description: t.exposeString('description', { nullable: true }),
      packSize: t.exposeString('packSize'),
      unitPrice: t.exposeFloat('unitPrice'),
      stockQuantity: t.exposeInt('stockQuantity'),
      category: t.exposeString('category'),
      subcategory: t.exposeString('subcategory', { nullable: true }),
      isActive: t.exposeBoolean('isActive'),
      createdAt: t.field({ type: 'Date', resolve: (p) => p.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (p) => p.updatedAt }),
    }),
  });

  gqlSchemaBuilder.prismaObject('WholesaleOrder', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      sellerId: t.exposeString('sellerId'),
      totalAmount: t.exposeFloat('totalAmount'),
      currency: t.exposeString('currency'),
      status: t.exposeString('status'),
      createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (o) => o.updatedAt }),
      items: t.relation('items'),
    }),
  });

  gqlSchemaBuilder.prismaObject('WholesaleOrderItem', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      orderId: t.exposeString('orderId'),
      productId: t.exposeString('productId'),
      quantity: t.exposeInt('quantity'),
      unitPrice: t.exposeFloat('unitPrice'),
      totalPrice: t.exposeFloat('totalPrice'),
    }),
  });

  // Queries
  gqlSchemaBuilder.queryField('wholesaleProducts', (t) =>
    t.prismaField({
      type: ['WholesaleProduct'],
      args: {
        category: t.arg.string({ required: false }),
        activeOnly: t.arg.boolean({ required: false }),
      },
      resolve: (query, _root, args) => {
        return prisma.wholesaleProduct.findMany({
          ...query,
          where: {
            ...(args.category ? { category: args.category as string } : {}),
            ...(args.activeOnly ? { isActive: true } : {}),
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
      },
    })
  );

  gqlSchemaBuilder.queryField('myWholesaleOrders', (t) =>
    t.prismaField({
      type: ['WholesaleOrder'],
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const sellerId = await requireSellerOrgId(ctx);
        return prisma.wholesaleOrder.findMany({
          ...query,
          where: { sellerId },
          orderBy: { createdAt: 'desc' },
        });
      },
    })
  );

  // Mutations
  const CheckoutItemInput = gqlSchemaBuilder.inputType(
    'WholesaleCheckoutItemInput',
    {
      fields: (t) => ({
        productId: t.id({ required: true }),
        quantity: t.int({ required: true }),
      }),
    }
  );
  const CheckoutInput = gqlSchemaBuilder.inputType('WholesaleCheckoutInput', {
    fields: (t) => ({
      items: t.field({ type: [CheckoutItemInput], required: true }),
      currency: t.string({ required: false }),
    }),
  });

  gqlSchemaBuilder.mutationField('wholesaleCheckout', (t) =>
    t.prismaField({
      type: 'WholesaleOrder',
      args: { input: t.arg({ type: CheckoutInput, required: true }) },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const sellerId = await requireSellerOrgId(ctx);

        const items = args.input.items;
        if (!items?.length) throw new Error('EMPTY_CART');

        return await prisma.$transaction(async (tx) => {
          // Fetch products and validate stock
          const productMap = new Map<string, any>();
          for (const item of items) {
            const p = await tx.wholesaleProduct.findUnique({
              where: { id: item.productId },
            });
            if (!p || !p.isActive) throw new Error('PRODUCT_UNAVAILABLE');
            if (p.stockQuantity < item.quantity)
              throw new Error('OUT_OF_STOCK');
            productMap.set(item.productId, p);
          }

          const total = items.reduce(
            (sum, it) =>
              sum + productMap.get(it.productId).unitPrice * it.quantity,
            0
          );
          const order = await tx.wholesaleOrder.create({
            data: {
              id: crypto.randomUUID(),
              sellerId,
              totalAmount: total,
              currency: args.input.currency ?? 'EUR',
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          for (const it of items) {
            const p = productMap.get(it.productId);
            await tx.wholesaleOrderItem.create({
              data: {
                id: crypto.randomUUID(),
                orderId: order.id,
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: p.unitPrice,
                totalPrice: p.unitPrice * it.quantity,
              },
            });
            await tx.wholesaleProduct.update({
              where: { id: it.productId },
              data: { stockQuantity: p.stockQuantity - it.quantity },
            });
          }

          return prisma.wholesaleOrder.findUniqueOrThrow({
            ...query,
            where: { id: order.id },
          });
        });
      },
    })
  );

  // Admin/stripe webhook simulation: mark order paid + idempotent confirmation log
  gqlSchemaBuilder.mutationField('markWholesaleOrderPaid', (t) =>
    t.prismaField({
      type: 'WholesaleOrder',
      args: { id: t.arg.id({ required: true }) },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const order = await prisma.wholesaleOrder.update({
          ...query,
          where: { id: args.id as string },
          data: { status: 'paid', updatedAt: new Date() },
        });
        const already = await prisma.stritAuditLog.findFirst({
          where: {
            eventType: 'WholesaleConfirmationEmailSent',
            entityType: 'WholesaleOrder',
            entityId: order.id,
          },
          select: { id: true },
        });
        if (!already) {
          try {
            await prisma.stritAuditLog.create({
              data: {
                id: crypto.randomUUID(),
                eventType: 'WholesaleConfirmationEmailSent',
                actorRole: 'system',
                actorId: ctx.user.id,
                entityType: 'WholesaleOrder',
                entityId: order.id,
              },
            });
          } catch {}
        }
        return order;
      },
    })
  );
}
