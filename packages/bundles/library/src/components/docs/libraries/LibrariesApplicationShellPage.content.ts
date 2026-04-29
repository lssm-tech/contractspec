export const shellUsageExample = `import {
  AppShell,
  type ShellCommandGroup,
  type ShellNavSection,
  type ShellNotificationCenter,
  type PageOutlineItem,
} from "@contractspec/lib.design-system/shell";

const navigation: ShellNavSection[] = [
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

const commands: ShellCommandGroup[] = [
  {
    heading: "Quick actions",
    items: [
      { id: "new-contract", label: "New contract", shortcut: "N" },
      { id: "import", label: "Import existing app" },
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

const notifications: ShellNotificationCenter = {
  label: "Notifications",
  loading: false,
  unreadCount: 2,
  items: [
    {
      id: "contract-approved",
      title: "Contract approved",
      body: "Billing.create is ready to publish.",
      status: "unread",
      createdAt: "2026-04-29T09:30:00Z",
      actionUrl: "/contracts/billing.create",
      category: "Review",
    },
  ],
  onSelect: (item) => openNotificationTarget(item),
  onMarkRead: (item) => markNotificationRead(item.id),
  onMarkAllRead: () => markAllNotificationsRead(),
};

export function WorkspacePage() {
  return (
    <AppShell
      title="ContractSpec"
      homeHref="/dashboard"
      navigation={navigation}
      commands={commands}
      breadcrumbs={[
        { label: "Workspace", href: "/dashboard" },
        { label: "Contracts" },
      ]}
      notifications={notifications}
      pageOutline={outline}
      activeHref="/contracts"
      activeOutlineId="desktop"
      userMenu={<UserMenu onSignOut={() => signOut()} />}
    >
      <main>{/* route content */}</main>
    </AppShell>
  );
}`;

export const notificationCenterExample = `import {
  ListNotificationsOutputModel,
  MarkNotificationReadInputModel,
} from "@contractspec/lib.contracts-spec/notifications";
import {
  notificationsSchemaContribution,
  renderNotificationTemplate,
} from "@contractspec/lib.notification";
import type { ShellNotificationCenter } from "@contractspec/lib.design-system/shell";

type NotificationListResult = {
  unreadCount: number;
  notifications: Array<{
    id: string;
    title: string;
    body: string;
    type: string;
    status: string;
    readAt?: string | Date | null;
    createdAt: string | Date;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
  }>;
};

export function toShellNotifications(
  data: NotificationListResult,
  actions: {
    open: (id: string) => void;
    markRead: (input: { notificationId: string }) => void;
    markAllRead: () => void;
  }
): ShellNotificationCenter {
  return {
    unreadCount: data.unreadCount,
    items: data.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      status: notification.status,
      createdAt: notification.createdAt,
      actionUrl: notification.actionUrl,
      category: notification.type,
      metadata: notification.metadata,
    })),
    onSelect: (item) => actions.open(item.id),
    onMarkRead: (item) => actions.markRead({ notificationId: item.id }),
    onMarkAllRead: actions.markAllRead,
  };
}

void ListNotificationsOutputModel;
void MarkNotificationReadInputModel;
void notificationsSchemaContribution;
void renderNotificationTemplate;`;

export const scratchPrompt = `You are implementing a modern application shell from scratch.

Goal:
Build a reusable application shell for a React/Next.js web app and an Expo React Native app. The shell must provide a desktop sidebar, desktop topbar, command search, breadcrumbs, nested navigation, user/auth actions, in-app notifications, and an in-page section navigator called PageOutline.

Use this architecture:
- Keep route content independent from navigation chrome.
- Create a typed navigation model with sections, items, active state, optional children, badges, icons, disabled items, and href/onSelect support.
- Create a command model with search input, grouped suggestions, quick actions, keyboard shortcut labels, empty state, and loading state.
- Create a breadcrumb model for the topbar.
- Create a PageOutline model for right-side in-page navigation with exactly three supported levels. It should render anchors, support active section state, and degrade gracefully when no sections exist.
- Create a ShellNotificationCenter model with render-ready items, unread count, loading and empty states, onSelect, onMarkRead, onMarkAllRead, and optional custom item rendering.
- Expose the system from the design system or a dedicated shell module, not from a single app route.

Notification boundary:
- Use @contractspec/lib.contracts-spec/notifications as the canonical source for notification contracts, operation models, and feature metadata.
- Use @contractspec/lib.notification for reusable notification entities, schema contribution, channels, templates, and i18n helpers.
- Keep persistence, polling/subscriptions, delivery providers, and optimistic mutations in the host application or notification runtime layer.
- Pass only render-ready ShellNotificationCenter state into AppShell so the design system does not import or own notification runtime behavior.

Desktop behavior:
- Persistent left sidebar with app logo/title, command trigger, grouped navigation, nested submenus, and current user/auth/logout area.
- Topbar with breadcrumbs and an optional command trigger.
- Topbar notification trigger with unread badge, loading/empty states, mark-read actions, and item selection.
- Content area with optional right PageOutline.
- Keep dimensions stable. Navigation labels must not resize layout on hover or active state.

Mobile web behavior:
- Use bottom navigation for the primary destinations.
- Put deeper navigation, command search, notifications, auth actions, and secondary actions behind a menu or drawer when the topbar cannot safely hold them.
- Keep route content first and make the shell controls reachable without covering important content.

Native behavior:
- Add .native.tsx entrypoints for Expo/React Native.
- Prefer bottom tabs for primary destinations and a menu/sheet for deeper navigation, notifications, and account actions.
- Keep the same typed navigation, command, breadcrumb, notification, and PageOutline data contracts across web and native.

Implementation constraints:
- Reuse the existing design-system primitives, tokens, icons, and accessibility patterns.
- Do not hardcode app-specific routes in the shell component.
- Do not introduce a new dependency unless the repo already uses it for dialogs, menus, icons, or navigation.
- Include tests for navigation rendering, nested items, command filtering, breadcrumbs, notification unread badge/loading/empty/callback behavior, PageOutline level handling, active section state, and mobile/native adaptation contracts.
- Update docs and exports so developers can import the shell from a stable public API.

Deliverables:
- Typed shell models.
- Web shell components.
- Native shell components or adapters.
- PageOutline component with three-level support.
- ShellNotifications or equivalent notification center component for web and native shell placement.
- Usage example.
- Focused tests and typecheck/build evidence.`;

export const refactorPrompt = `You are refactoring an existing application to use the shared application shell system.

Goal:
Replace app-specific sidebar, topbar, breadcrumb, command palette, notification badge/inbox, account menu, mobile navigation, and in-page table-of-contents code with the shared AppShell, ShellNotifications, and PageOutline system.

Start by auditing:
- Current layout wrappers and route groups.
- Sidebar, topbar, breadcrumb, command/search, auth menu, and mobile navigation implementations.
- Existing notification badges, inbox panels, toasts that represent durable in-app items, unread count queries, mark-read actions, and delivery modules.
- Imports from @contractspec/module.notifications that should migrate to @contractspec/lib.contracts-spec/notifications or @contractspec/lib.notification.
- Any duplicated navigation arrays, route labels, icon maps, access-control checks, and active-state logic.
- Any in-page summary/table-of-contents components that should become PageOutline data.
- Web-only assumptions that would block Expo/React Native adaptation.

Refactor plan:
1. Define a single typed navigation source for primary nav, grouped sidebar nav, nested children, labels, icons, badges, disabled states, and permissions.
2. Map existing command/search behavior into grouped command actions with search text and quick actions.
3. Map existing route metadata into breadcrumbs.
4. Move canonical notification contracts to @contractspec/lib.contracts-spec/notifications and reusable helpers to @contractspec/lib.notification; keep the old module shim only for compatibility imports that still need the legacy module id.
5. Convert notification query results into ShellNotificationCenter items with unreadCount, loading, empty state, onSelect, onMarkRead, and onMarkAllRead callbacks.
6. Convert page table-of-contents or section summary data into PageOutline items with a maximum of three levels.
7. Wrap app routes in AppShell while keeping page content components route-local.
8. Move primary mobile destinations into bottom navigation and deeper/account/notification actions into a menu or drawer.
9. Add or preserve .native.tsx adapters when the app targets Expo.

Preserve behavior:
- Existing route URLs and access rules.
- Existing keyboard shortcuts where they are public behavior.
- Existing analytics or telemetry events on navigation and command actions.
- Existing notification delivery semantics, unread count semantics, deep links, and mark-read behavior.
- Existing auth/logout behavior.
- Existing responsive breakpoints unless there is a documented design-system breakpoint to adopt.

Quality gates:
- Add regression tests around current visible navigation before removing old shell code when coverage is missing.
- Test active nav state, nested nav expansion, command search/action invocation, breadcrumbs, notification unread badge/loading/empty/callback behavior, auth menu, mobile bottom navigation, and PageOutline anchor behavior.
- Run lint, typecheck, and the app's relevant test/build command.
- Remove dead app-specific shell components only after the shared shell path is verified.

Output:
- List old shell files removed or simplified.
- List new shared shell integration points.
- Include before/after route coverage and verification commands.`;

export const notificationGuide = [
	{
		title: 'Contracts stay canonical',
		body: 'Use @contractspec/lib.contracts-spec/notifications for operation models, feature metadata, and contract-level compatibility.',
	},
	{
		title: 'Runtime helpers stay reusable',
		body: 'Use @contractspec/lib.notification for schema contribution, channel adapters, templates, and i18n without importing the deprecated module shim in new code.',
	},
	{
		title: 'Apps own live state',
		body: 'Fetch, subscribe, persist, mutate, and reconcile notification state in the host app or runtime layer where auth and tenancy are known.',
	},
	{
		title: 'Shell receives view state',
		body: 'Pass AppShell a ShellNotificationCenter with render-ready items, counts, loading state, and callbacks; the design system only renders affordances.',
	},
] as const;

export const shellParts = [
	{
		title: 'Sidebar',
		body: 'Desktop owns brand, command entry, grouped navigation, nested items, and account actions in one persistent scanning area.',
	},
	{
		title: 'Topbar',
		body: 'Breadcrumbs stay visible while the current route changes. Command search and notification affordances can live here when the sidebar is collapsed or hidden.',
	},
	{
		title: 'PageOutline',
		body: 'The right-side in-page navigator replaces ad hoc tables of contents. It supports three levels of section anchors and active state.',
	},
	{
		title: 'Notifications',
		body: 'The shell renders unread badges, item lists, loading/empty states, mark-read actions, and deep-link selection from host-owned notification state.',
	},
	{
		title: 'Mobile adapters',
		body: 'Small web and native surfaces move primary destinations to bottom navigation and reserve drawers or menus for deep navigation, notifications, and account actions.',
	},
] as const;
