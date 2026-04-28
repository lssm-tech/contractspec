export const shellUsageExample = `import {
  AppShell,
  PageOutline,
  type AppShellNavigationSection,
  type PageOutlineItem,
} from "@contractspec/lib.design-system/shell";

const navigation: AppShellNavigationSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      {
        label: "Contracts",
        href: "/contracts",
        children: [
          { label: "Operations", href: "/contracts/operations" },
          { label: "Events", href: "/contracts/events" },
        ],
      },
    ],
  },
];

const outline: PageOutlineItem[] = [
  {
    id: "architecture",
    label: "Architecture",
    level: 1,
    children: [
      { id: "desktop", label: "Desktop shell", level: 2 },
      { id: "mobile", label: "Mobile adaptation", level: 2 },
    ],
  },
];

export function WorkspacePage() {
  return (
    <AppShell
      brand={{ label: "ContractSpec", href: "/dashboard" }}
      navigation={navigation}
      breadcrumbs={[
        { label: "Workspace", href: "/dashboard" },
        { label: "Contracts" },
      ]}
      command={{
        placeholder: "Search contracts or run an action",
        groups: [
          {
            title: "Quick actions",
            actions: [
              { id: "new-contract", label: "New contract" },
              { id: "import", label: "Import existing app" },
            ],
          },
        ],
      }}
      user={{
        name: "Ada Lovelace",
        email: "ada@example.com",
        actions: [{ label: "Sign out", onSelect: () => signOut() }],
      }}
      pageOutline={<PageOutline items={outline} activeId="desktop" />}
    >
      <main>{/* route content */}</main>
    </AppShell>
  );
}`;

export const scratchPrompt = `You are implementing a modern application shell from scratch.

Goal:
Build a reusable application shell for a React/Next.js web app and an Expo React Native app. The shell must provide a desktop sidebar, desktop topbar, command search, breadcrumbs, nested navigation, user/auth actions, and an in-page section navigator called PageOutline.

Use this architecture:
- Keep route content independent from navigation chrome.
- Create a typed navigation model with sections, items, active state, optional children, badges, icons, disabled items, and href/onSelect support.
- Create a command model with search input, grouped suggestions, quick actions, keyboard shortcut labels, empty state, and loading state.
- Create a breadcrumb model for the topbar.
- Create a PageOutline model for right-side in-page navigation with exactly three supported levels. It should render anchors, support active section state, and degrade gracefully when no sections exist.
- Expose the system from the design system or a dedicated shell module, not from a single app route.

Desktop behavior:
- Persistent left sidebar with app logo/title, command trigger, grouped navigation, nested submenus, and current user/auth/logout area.
- Topbar with breadcrumbs and an optional command trigger.
- Content area with optional right PageOutline.
- Keep dimensions stable. Navigation labels must not resize layout on hover or active state.

Mobile web behavior:
- Use bottom navigation for the primary destinations.
- Put deeper navigation, command search, auth actions, and secondary actions behind a menu or drawer.
- Keep route content first and make the shell controls reachable without covering important content.

Native behavior:
- Add .native.tsx entrypoints for Expo/React Native.
- Prefer bottom tabs for primary destinations and a menu/sheet for deeper navigation and account actions.
- Keep the same typed navigation, command, breadcrumb, and PageOutline data contracts across web and native.

Implementation constraints:
- Reuse the existing design-system primitives, tokens, icons, and accessibility patterns.
- Do not hardcode app-specific routes in the shell component.
- Do not introduce a new dependency unless the repo already uses it for dialogs, menus, icons, or navigation.
- Include tests for navigation rendering, nested items, command filtering, breadcrumbs, PageOutline level handling, active section state, and mobile/native adaptation contracts.
- Update docs and exports so developers can import the shell from a stable public API.

Deliverables:
- Typed shell models.
- Web shell components.
- Native shell components or adapters.
- PageOutline component with three-level support.
- Usage example.
- Focused tests and typecheck/build evidence.`;

export const refactorPrompt = `You are refactoring an existing application to use the shared application shell system.

Goal:
Replace app-specific sidebar, topbar, breadcrumb, command palette, account menu, mobile navigation, and in-page table-of-contents code with the shared AppShell and PageOutline system.

Start by auditing:
- Current layout wrappers and route groups.
- Sidebar, topbar, breadcrumb, command/search, auth menu, and mobile navigation implementations.
- Any duplicated navigation arrays, route labels, icon maps, access-control checks, and active-state logic.
- Any in-page summary/table-of-contents components that should become PageOutline data.
- Web-only assumptions that would block Expo/React Native adaptation.

Refactor plan:
1. Define a single typed navigation source for primary nav, grouped sidebar nav, nested children, labels, icons, badges, disabled states, and permissions.
2. Map existing command/search behavior into grouped command actions with search text and quick actions.
3. Map existing route metadata into breadcrumbs.
4. Convert page table-of-contents or section summary data into PageOutline items with a maximum of three levels.
5. Wrap app routes in AppShell while keeping page content components route-local.
6. Move primary mobile destinations into bottom navigation and deeper/account actions into a menu or drawer.
7. Add or preserve .native.tsx adapters when the app targets Expo.

Preserve behavior:
- Existing route URLs and access rules.
- Existing keyboard shortcuts where they are public behavior.
- Existing analytics or telemetry events on navigation and command actions.
- Existing auth/logout behavior.
- Existing responsive breakpoints unless there is a documented design-system breakpoint to adopt.

Quality gates:
- Add regression tests around current visible navigation before removing old shell code when coverage is missing.
- Test active nav state, nested nav expansion, command search/action invocation, breadcrumbs, auth menu, mobile bottom navigation, and PageOutline anchor behavior.
- Run lint, typecheck, and the app's relevant test/build command.
- Remove dead app-specific shell components only after the shared shell path is verified.

Output:
- List old shell files removed or simplified.
- List new shared shell integration points.
- Include before/after route coverage and verification commands.`;

export const shellParts = [
	{
		title: 'Sidebar',
		body: 'Desktop owns brand, command entry, grouped navigation, nested items, and account actions in one persistent scanning area.',
	},
	{
		title: 'Topbar',
		body: 'Breadcrumbs stay visible while the current route changes. The command trigger can live here when the sidebar is collapsed or hidden.',
	},
	{
		title: 'PageOutline',
		body: 'The right-side in-page navigator replaces ad hoc tables of contents. It supports three levels of section anchors and active state.',
	},
	{
		title: 'Mobile adapters',
		body: 'Small web and native surfaces move primary destinations to bottom navigation and reserve drawers or menus for deep navigation and account actions.',
	},
] as const;
