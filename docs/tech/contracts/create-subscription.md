### Subscriptions via Better Auth Stripe

This app uses Better Auth's Stripe plugin for subscription management.

Key endpoints:

- `/api/auth/[...all]` – Better Auth server
- `/api/auth/stripe/webhook` – Stripe webhook handled by Better Auth

Client usage (org mode):

```ts
import { subscription } from '@/lib/auth-client';

await subscription.upgrade({
  plan: 'core',
  annual: true,
  referenceId: activeOrganization?.id,
  successUrl: '/dashboard',
  cancelUrl: '/pricing',
});
```

Plans are configured in `src/lib/auth.ts` referencing env-provided price IDs. See Better Auth Stripe docs: [plugins: Stripe](`https://better-auth.com/docs/plugins/stripe.mdx`) and [Using with organizations](`https://www.better-auth.com/docs/plugins/stripe#using-with-organizations`).

Landing pricing UX

- Components: `SectionEyebrow`, `PriceBadge`, `FeatureList`, `PriceCard`
- Sections: `PricingSection`, `StoryPricingBenefits`
- Canonical pricing source: `src/lib/pricing/config.ts`

Trial period

- Le plan « Essentiel » inclut une période d’essai gratuite de 30 jours.
- Config côté auth: `freeTrial: { days: 30 }` dans `src/lib/auth.ts` (Better Auth Stripe plugin).
- Config côté pricing: `trial: { days: 30 }` dans `src/lib/pricing/config.ts`.

Dashboard badges

- Le `Tableau de bord` affiche des badges d’état d’abonnement:
  - « Essai · se termine le JJ/MM/AAAA » lorsque l’essai est en cours
  - « Abonnement actif » lorsque l’abonnement est actif
  - « Annulé · fin au terme de la période » lorsque la résiliation est planifiée
- Composant: `components/dashboard/DashboardPage/molecules/Header.tsx`
- Source des états: hook `useProfileBillingPage()` (`components/profile/ProfileBillingPage/hooks/useProfileBillingPage.tsx`)
