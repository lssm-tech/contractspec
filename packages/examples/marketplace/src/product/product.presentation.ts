import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { ProductModel } from './product.schema';

export const ProductCatalogPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.product.catalog',
    version: 1,
    title: 'Product Catalog',
    description: 'Product catalog with search and filters',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'catalog'],
    stability: StabilityEnum.Experimental,
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
    title: 'Product Details',
    description: 'Product detail page with images and reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'detail'],
    stability: StabilityEnum.Experimental,
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
    title: 'Product Editor',
    description: 'Product editor for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'editor'],
    stability: StabilityEnum.Experimental,
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
