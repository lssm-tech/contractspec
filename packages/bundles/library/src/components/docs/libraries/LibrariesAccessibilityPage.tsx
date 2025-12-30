import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: '@contractspec/lib.accessibility: ContractSpec Docs',
//   description: 'Accessibility primitives for WCAG compliance.',
// };

export function LibrariesAccessibilityPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.accessibility</h1>
        <p className="text-muted-foreground">
          Stable exports of accessibility primitives for LSSM web apps, ensuring
          WCAG compliance and inclusive design.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`npm install @contractspec/lib.accessibility
# or
bun add @contractspec/lib.accessibility`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Exports</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <code className="bg-background/50 rounded px-2 py-1">SkipLink</code>
            : A link to skip navigation, visible on focus
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              VisuallyHidden
            </code>
            : Hide content visually but keep it for screen readers
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              SRLiveRegionProvider
            </code>
            ,{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              useSRLiveRegion
            </code>
            : Manage live region announcements
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              RouteAnnouncer
            </code>
            : Announce page title/path changes on navigation
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              FocusOnRouteChange
            </code>
            : Reset focus to body or main content on navigation
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              useReducedMotion
            </code>
            : Detect if the user prefers reduced motion
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: App Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import {
  SRLiveRegionProvider,
  RouteAnnouncer,
  SkipLink
} from '@contractspec/lib.accessibility';

export function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SRLiveRegionProvider>
          <SkipLink />
          <RouteAnnouncer />
          <main id="main-content">
            {children}
          </main>
        </SRLiveRegionProvider>
      </body>
    </html>
  );
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Live Announcements</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { useSRLiveRegion } from '@contractspec/lib.accessibility';

export function TodoList() {
  const { announce } = useSRLiveRegion();

  const addTodo = () => {
    // ... add logic
    announce('Todo added successfully', 'polite');
  };

  return <button onClick={addTodo}>Add Todo</button>;
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">WCAG Compliance</h2>
        <p className="text-muted-foreground">
          These components map directly to WCAG 2.1 Level AA requirements
          documented in <code>docs/accessibility_wcag_compliance_specs.md</code>
          :
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>2.4.1 Bypass Blocks (SkipLink)</li>
          <li>4.1.3 Status Messages (LiveRegion)</li>
          <li>2.4.3 Focus Order (FocusOnRouteChange)</li>
          <li>2.3.3 Animation from Interactions (useReducedMotion)</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/design-system" className="btn-ghost">
          Previous: Design System
        </Link>
        <Link href="/docs/libraries" className="btn-primary">
          Back to Libraries <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
