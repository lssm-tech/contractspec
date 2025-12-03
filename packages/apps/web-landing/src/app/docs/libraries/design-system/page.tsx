import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: '@lssm/lib.design-system: ContractSpec Docs',
//   description:
//     'High-level design system components, patterns, and layouts for LSSM applications.',
// };

export default function DesignSystemLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.design-system</h1>
        <p className="text-muted-foreground">
          High-level design system components, patterns, and layouts for LSSM
          applications. Built on top of <code>@lssm/lib.ui-kit</code>.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`npm install @lssm/lib.design-system
# or
bun add @lssm/lib.design-system`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What It Provides</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Composite Components</strong>: Molecules and Organisms that
            solve common UI problems
          </li>
          <li>
            <strong>Layouts</strong>: Ready-to-use page structures for
            dashboards, marketing sites, and lists
          </li>
          <li>
            <strong>Data Views</strong>: Standardized renderers for lists,
            tables, and detail views
          </li>
          <li>
            <strong>Forms</strong>: Zod-integrated form layouts and components
          </li>
          <li>
            <strong>Platform Utilities</strong>: Hooks for responsive and
            adaptive design
          </li>
          <li>
            <strong>Legal Templates</strong>: Compliant templates for Terms,
            Privacy, and GDPR
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: App Layout</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { AppLayout } from '@lssm/lib.design-system/components/organisms/AppLayout';
import { AppSidebar } from '@lssm/lib.design-system/components/organisms/AppSidebar';

export default function Layout({ children }) {
  return (
    <AppLayout sidebar={<AppSidebar />}>
      {children}
    </AppLayout>
  );
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Zod Form</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { ZodForm } from '@lssm/lib.design-system/components/forms/ZodForm';
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
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key Exports</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Organisms</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>AppLayout, AppHeader, AppSidebar</li>
              <li>MarketingLayout, HeroSection</li>
              <li>ListCardPage, ListTablePage</li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Data & Forms</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>DataViewRenderer</li>
              <li>ZodForm</li>
              <li>FormLayout, FormDialog</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/ui-kit" className="btn-ghost">
          Previous: UI Kit
        </Link>
        <Link href="/docs/libraries/accessibility" className="btn-primary">
          Next: Accessibility <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
