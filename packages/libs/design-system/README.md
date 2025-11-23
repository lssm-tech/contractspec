# @lssm/lib.design-system

High-level design system components, patterns, and layouts for LSSM applications. Built on top of `@lssm/lib.ui-kit`.

## Purpose

To standardize the look and feel of LSSM applications by providing:

- **Composite Components**: Molecules and Organisms that solve common UI problems (headers, sidebars, cards).
- **Layouts**: Ready-to-use page structures for dashboards, marketing sites, and lists.
- **Data Views**: Standardized renderers for lists, tables, and details views.
- **Forms**: Zod-integrated form layouts and components.
- **Platform Utilities**: Hooks and helpers for responsive and adaptive design (Mobile/Web).
- **Legal**: Compliant templates for Terms, Privacy, and GDPR.

## Installation

```bash
npm install @lssm/lib.design-system
# or
bun add @lssm/lib.design-system
```

## Key Concepts

- **Platform Agnostic Logic**: Business logic hooks are shared where possible.
- **Platform Specific UI**: `.mobile.ts(x)` and `.web.ts(x)` extensions allow for tailored experiences while maintaining a unified API.
- **Contract-Driven**: Components like `DataViewRenderer` and `ZodForm` are designed to work directly with `ContractSpec` definitions.
- **Theming**: Centralized token bridge and variant definitions.

## Exports

### Atoms & Molecules

- `Button`, `Input`, `Link` (Platform-aware wrappers)
- `ActionButtons`, `DataChips`, `EmptyState`, `ErrorState`
- `Breadcrumbs`, `CommandPalette`, `DropdownMenu`, `EntityCard`
- `FiltersToolbar`, `LangSwitch`, `LoaderBlock`, `StatCard`

### Organisms (Complex UI)

- **App Shell**: `AppLayout`, `AppHeader`, `AppSidebar`, `Footer`
- **Marketing**: `MarketingLayout`, `HeroSection`, `FeaturesSection`, `PricingSection`
- **Lists**: `ListCardPage`, `ListGridPage`, `ListTablePage`
- **Legal**: `LegalPageLayout`, `GDPRRights`, `ContactForm`

### Data & Forms

- `DataViewRenderer`: Auto-renders data based on schema.
- `ZodForm`: Auto-generates forms from Zod schemas.
- `FormLayout`, `FormDialog`, `FormStepsLayout`

### Templates

- `ListPageTemplate`
- Legal: `PrivacyTemplate`, `TermsTemplate`, `CookiesTemplate`

## Usage

### App Layout

```tsx
import { AppLayout } from '@lssm/lib.design-system/components/organisms/AppLayout';
import { AppSidebar } from '@lssm/lib.design-system/components/organisms/AppSidebar';

export default function Layout({ children }) {
  return <AppLayout sidebar={<AppSidebar />}>{children}</AppLayout>;
}
```

### Zod Form

```tsx
import { ZodForm } from '@lssm/lib.design-system/components/forms/ZodForm';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export function SignupForm() {
  return (
    <ZodForm
      schema={schema}
      onSubmit={(data) => console.log(data)}
      submitLabel="Sign Up"
    />
  );
}
```










