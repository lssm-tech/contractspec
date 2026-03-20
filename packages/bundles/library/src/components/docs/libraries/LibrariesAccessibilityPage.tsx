import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesAccessibilityPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.accessibility</h1>
				<p className="text-muted-foreground">
					Stable exports of accessibility primitives for LSSM web apps, ensuring
					WCAG compliance and inclusive design.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.accessibility" />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Exports</h2>
				<ul className="space-y-2 text-muted-foreground">
					<li>
						<code className="rounded bg-background/50 px-2 py-1">SkipLink</code>
						: A link to skip navigation, visible on focus
					</li>
					<li>
						<code className="rounded bg-background/50 px-2 py-1">
							VisuallyHidden
						</code>
						: Hide content visually but keep it for screen readers
					</li>
					<li>
						<code className="rounded bg-background/50 px-2 py-1">
							SRLiveRegionProvider
						</code>
						,{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							useSRLiveRegion
						</code>
						: Manage live region announcements
					</li>
					<li>
						<code className="rounded bg-background/50 px-2 py-1">
							RouteAnnouncer
						</code>
						: Announce page title/path changes on navigation
					</li>
					<li>
						<code className="rounded bg-background/50 px-2 py-1">
							FocusOnRouteChange
						</code>
						: Reset focus to body or main content on navigation
					</li>
					<li>
						<code className="rounded bg-background/50 px-2 py-1">
							useReducedMotion
						</code>
						: Detect if the user prefers reduced motion
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Example: App Setup</h2>
				<CodeBlock
					language="tsx"
					code={`import {
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
}`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Example: Live Announcements</h2>
				<CodeBlock
					language="tsx"
					code={`import { useSRLiveRegion } from '@contractspec/lib.accessibility';

export function TodoList() {
  const { announce } = useSRLiveRegion();

  const addTodo = () => {
    // ... add logic
    announce('Todo added successfully', 'polite');
  };

  return <button onClick={addTodo}>Add Todo</button>;
}`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">WCAG Compliance</h2>
				<p className="text-muted-foreground">
					These components map directly to WCAG 2.1 Level AA requirements
					documented in <code>docs/accessibility_wcag_compliance_specs.md</code>
					:
				</p>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
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
