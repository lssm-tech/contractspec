import { defineFeature } from '@contractspec/lib.contracts-spec';

export const KnowledgeCanonFeature = defineFeature({
  meta: {
    key: 'knowledge-canon',
    version: '1.0.0',
    title: 'Product Canon Knowledge Space',
    description:
      'Curated product knowledge space with blueprint, tenant config, and FAQ workflow',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['knowledge', 'canon', 'faq'],
    stability: 'experimental',
  },

  knowledge: [{ key: 'knowledge.product-canon', version: '1.0.0' }],

  workflows: [{ key: 'artisan.knowledge.answerFaq', version: '1.0.0' }],

  docs: [
    'docs.examples.knowledge-canon',
    'docs.examples.knowledge-canon.usage',
  ],
});
