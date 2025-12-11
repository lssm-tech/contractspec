import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_contracts_create_subscription_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.create-subscription',
    title: 'Subscriptions via Better Auth Stripe',
    summary:
      "This app uses Better Auth's Stripe plugin for subscription management.",
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/create-subscription',
    tags: ['tech', 'contracts', 'create-subscription'],
    body: "### Subscriptions via Better Auth Stripe\n\nThis app uses Better Auth's Stripe plugin for subscription management.\n\nKey endpoints:\n\n- `/api/auth/[...all]` \u2013 Better Auth server\n- `/api/auth/stripe/webhook` \u2013 Stripe webhook handled by Better Auth\n\nClient usage (org mode):\n\n```ts\nimport { subscription } from '@/lib/auth-client';\n\nawait subscription.upgrade({\n  plan: 'core',\n  annual: true,\n  referenceId: activeOrganization?.id,\n  successUrl: '/dashboard',\n  cancelUrl: '/pricing',\n});\n```\n\nPlans are configured in `src/lib/auth.ts` referencing env-provided price IDs. See Better Auth Stripe docs: [plugins: Stripe](`https://better-auth.com/docs/plugins/stripe.mdx`) and [Using with organizations](`https://www.better-auth.com/docs/plugins/stripe#using-with-organizations`).\n\nLanding pricing UX\n\n- Components: `SectionEyebrow`, `PriceBadge`, `FeatureList`, `PriceCard`\n- Sections: `PricingSection`, `StoryPricingBenefits`\n- Canonical pricing source: `src/lib/pricing/config.ts`\n\nTrial period\n\n- Le plan \u00ab Essentiel \u00bb inclut une p\u00e9riode d\u2019essai gratuite de 30 jours.\n- Config c\u00f4t\u00e9 auth: `freeTrial: { days: 30 }` dans `src/lib/auth.ts` (Better Auth Stripe plugin).\n- Config c\u00f4t\u00e9 pricing: `trial: { days: 30 }` dans `src/lib/pricing/config.ts`.\n\nDashboard badges\n\n- Le `Tableau de bord` affiche des badges d\u2019\u00e9tat d\u2019abonnement:\n  - \u00ab Essai \u00b7 se termine le JJ/MM/AAAA \u00bb lorsque l\u2019essai est en cours\n  - \u00ab Abonnement actif \u00bb lorsque l\u2019abonnement est actif\n  - \u00ab Annul\u00e9 \u00b7 fin au terme de la p\u00e9riode \u00bb lorsque la r\u00e9siliation est planifi\u00e9e\n- Composant: `components/dashboard/DashboardPage/molecules/Header.tsx`\n- Source des \u00e9tats: hook `useProfileBillingPage()` (`components/profile/ProfileBillingPage/hooks/useProfileBillingPage.tsx`)\n",
  },
];
registerDocBlocks(tech_contracts_create_subscription_DocBlocks);
