import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';
import { ProductModel } from './product.schema';

export const ProductCatalogPresentation = definePresentation({
  meta: {
    key: 'marketplace.product.catalog',
    version: '1.0.0',
    title: 'Product Catalog',
    description: 'Product catalog with search and filters',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'catalog'],
    stability: StabilityEnum.Experimental,
    goal: 'Enable users to browse and search for products.',
    context: 'The primary shopping interface.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductCatalog',
    props: ProductModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.products.enabled'],
  },
});

export const ProductDetailPresentation = definePresentation({
  meta: {
    key: 'marketplace.product.detail',
    version: '1.0.0',
    title: 'Product Details',
    description: 'Product detail page with images and reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide comprehensive information about a specific product.',
    context: 'Product showcase including images, descriptions, and ratings.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductDetail',
    props: ProductModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.products.enabled'],
  },
});

export const ProductEditorPresentation = definePresentation({
  meta: {
    key: 'marketplace.product.editor',
    version: '1.0.0',
    title: 'Product Editor',
    description: 'Product editor for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'editor'],
    stability: StabilityEnum.Experimental,
    goal: 'Allow sellers to create and modify product listings.',
    context: 'Management tool for store owners.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductEditor',
    props: ProductModel,
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
});
