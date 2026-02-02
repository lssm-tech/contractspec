import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

/**
 * DocBlocks for the in-app documentation example.
 *
 * These blocks provide publicly visible guides aimed at non‑technical users.
 * Each DocBlock is associated with a route under /docs/examples/in-app-docs
 * and will be rendered in the ContractSpec sandbox or within your app if you
 * integrate the documentation.
 */
// Export the DocBlocks array so it can be reused by the UI layer.
export const inAppDocs: DocBlock[] = [
  {
    id: 'docs.examples.in-app-docs',
    title: 'In‑App Docs — Overview',
    summary:
      'Overview of the in‑app documentation example demonstrating how DocBlock can serve end‑user guides.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/in-app-docs',
    tags: ['documentation', 'overview', 'guide'],
    body: `## Purpose
The in‑app documentation example shows how you can use ContractSpec's DocBlock system to build user‑facing guides directly inside an application's UI.

Instead of relying solely on developer documentation, you can define **public** DocBlocks that describe your product's features in clear, non‑technical language. When embedded in your app, these blocks present a self‑contained help centre for users.

## What you'll learn
* How to define DocBlock objects with public visibility and user‑friendly routes.
* How to structure an overview page for your in‑app guide using Markdown.
* How to register your DocBlocks so they show up in the sandbox and in your application.

Use this example as a template for documenting your own frontend workflows.`,
  },
  {
    id: 'docs.examples.in-app-docs.usage',
    title: 'In‑App Docs — Using the Application',
    summary:
      'Step‑by‑step guide for end users to navigate and use the example application.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/in-app-docs/usage',
    tags: ['documentation', 'usage', 'guide'],
    body: `## Getting Started
1. **Sign in**. Launch the app and enter your credentials. New users can click **Create Account** to register.
2. **Explore the dashboard**. Use the sidebar or navigation bar to access sections like Dashboard, Profile, and Settings.
3. **Add items**. On the Dashboard, click **Add Item** or a plus icon to create a new record. Fill in the form fields and press **Save**.

## Tips
* Look for information icons (ℹ️) throughout the UI. Hover or click these icons to display contextual help powered by DocBlock.
* Use keyboard shortcuts—such as **Ctrl+S** to save or **Ctrl+K** to open the command palette—for quicker navigation.
* Need to find something quickly? Use the search bar or filters at the top of lists.

## Next Steps
Continue exploring the different screens. Try editing or deleting items, adjusting your profile settings, or experimenting with filters.
This guide is available via the help menu inside the app, so you can reference it without leaving your workflow.`,
  },
];

registerDocBlocks(inAppDocs);
