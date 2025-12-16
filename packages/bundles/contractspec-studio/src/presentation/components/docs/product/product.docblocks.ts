import type { DocBlock } from '@lssm/lib.contracts/docs';

export const productDocs: DocBlock[] = [
  {
    id: 'docs.product.lifecycle-stages.goal',
    title: 'Lifecycle stages goal',
    summary: 'Why lifecycle staging exists for ContractSpec products.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/product/lifecycle-stages/goal',
    tags: ['product', 'lifecycle'],
    body: 'Provide a clear, staged journey so teams can adopt ContractSpec incrementally with measurable milestones and ceremonies.',
  },
  {
    id: 'docs.product.lifecycle-stages.usage',
    title: 'Lifecycle stages usage',
    summary: 'How to use lifecycle stages across products.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/product/lifecycle-stages/usage',
    tags: ['product', 'lifecycle'],
    body: `- Map tenant or project to a lifecycle stage using assessment signals.
- Use stage checklists to guide adoption; trigger ceremonies on stage change.
- Keep stage definitions versioned and referenced by UI and ops docs.
- Align product messaging to the current stage for clarity and expectation setting.`,
  },
  {
    id: 'docs.product.lifecycle-stages.how',
    title: 'Lifecycle stages reference',
    summary: 'Reference of lifecycle stages and guidance (from markdown).',
    kind: 'how',
    visibility: 'public',
    route: '/docs/product/lifecycle-stages/how',
    tags: ['product', 'lifecycle'],
    body: `# Lifecycle Stages

Refer to lifecycle stages definition and guidance in product docs. Keep stage names, descriptions, and ceremonies aligned with implementation and ops runbooks.`,
  },
  {
    id: 'docs.product.lifecycle-user-guide.goal',
    title: 'Lifecycle user guide goal',
    summary: 'Why the lifecycle user guide exists.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/product/lifecycle-user-guide/goal',
    tags: ['product', 'lifecycle'],
    body: 'Help users navigate lifecycle assessments, recommendations, and ceremonies without requiring ops intervention.',
  },
  {
    id: 'docs.product.lifecycle-user-guide.usage',
    title: 'Lifecycle user guide usage',
    summary: 'How users should follow lifecycle guidance.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/product/lifecycle-user-guide/usage',
    tags: ['product', 'lifecycle'],
    body: `- Review recommended actions after each assessment.
- Complete milestone checklists to progress stages.
- Acknowledge stage regressions and follow suggested remediation.
- Use the Studio UI to trigger reassessments when major changes occur.`,
  },
  {
    id: 'docs.product.lifecycle-user-guide.how',
    title: 'Lifecycle user guide reference',
    summary: 'Reference content for lifecycle user guide.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/product/lifecycle-user-guide/how',
    tags: ['product', 'lifecycle'],
    body: `# Lifecycle User Guide

User-facing guide for navigating lifecycle assessments, recommendations, and ceremonies. Keep aligned with runtime logic and ops runbooks.`,
  },
];









