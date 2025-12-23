import type { PresentationSpec } from '@lssm/lib.contracts';
import { ProductModel } from './product.schema';

export const ProductCatalogPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.product.catalog',
    version: 1,
    description: 'Product catalog with search and filters',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'catalog'],
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
};

export const ProductDetailPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.product.detail',
    version: 1,
    description: 'Product detail page with images and reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'detail'],
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
};

export const ProductEditorPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.product.editor',
    version: 1,
    description: 'Product editor for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'editor'],
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
};
