# @lssm/example.marketplace

A comprehensive multi-vendor marketplace example demonstrating ContractSpec principles.

## Features

- **Multi-Vendor Stores**: Seller storefronts with profiles and verification
- **Product Catalog**: Products with variants, categories, and inventory tracking
- **Order Management**: Full order lifecycle with status tracking
- **Payment Processing**: Commission calculation and seller payouts
- **Reviews & Ratings**: Customer feedback with seller responses
- **File Attachments**: Product images and media using @lssm/lib.files
- **Usage Metering**: Platform analytics using @lssm/lib.metering

## Entities

### Store
- `Store` - Seller storefront
- `StoreCategory` - Store categorization

### Product
- `Product` - Product listing
- `ProductVariant` - Product variations (size, color)
- `Category` - Product categorization

### Order
- `Order` - Purchase transaction
- `OrderItem` - Items in an order
- `Refund` - Refund records
- `RefundItem` - Items being refunded

### Payout
- `Payout` - Payment to seller
- `PayoutItem` - Orders in a payout
- `BankAccount` - Seller payment destination
- `PayoutSettings` - Payout configuration

### Review
- `Review` - Customer review
- `ReviewResponse` - Seller response
- `ReviewVote` - Helpfulness votes
- `ReviewReport` - Flagged reviews

## Contracts

### Store Operations
- `marketplace.store.create` - Create a seller store

### Product Operations
- `marketplace.product.create` - Create a product
- `marketplace.product.list` - List/search products

### Order Operations
- `marketplace.order.create` - Create an order
- `marketplace.order.updateStatus` - Update order status

### Payout Operations
- `marketplace.payout.list` - List payouts

### Review Operations
- `marketplace.review.create` - Create a review
- `marketplace.review.list` - List reviews

## Events

- Store: `created`, `statusChanged`
- Product: `created`, `published`, `inventory.updated`
- Order: `created`, `paid`, `statusUpdated`, `shipped`, `completed`
- Payout: `created`, `paid`
- Review: `created`, `responded`

## Commission Model

The marketplace uses a configurable commission model:

```typescript
// Default 10% commission
const commission = calculateCommission(orderTotal, 0.1);

// Result:
{
  subtotal: 100,
  platformFee: 10,
  sellerPayout: 90
}
```

## Usage

```typescript
import { 
  CreateOrderContract,
  ListProductsContract,
  marketplaceSchemaContribution 
} from '@lssm/example.marketplace';

// List products
const products = await executeQuery(ListProductsContract, {
  categoryId: 'electronics',
  minPrice: 10,
  maxPrice: 100,
  limit: 20,
});

// Create an order
const order = await executeContract(CreateOrderContract, {
  storeId: 'store_123',
  items: [
    { productId: 'prod_456', quantity: 2 },
    { productId: 'prod_789', variantId: 'var_abc', quantity: 1 },
  ],
  shippingAddress: { ... },
});
```

## Dependencies

- `@lssm/lib.identity-rbac` - User identity and roles
- `@lssm/lib.files` - Product images and media
- `@lssm/lib.metering` - Usage tracking and analytics
- `@lssm/module.audit-trail` - Action auditing
- `@lssm/module.notifications` - Order and payout notifications




