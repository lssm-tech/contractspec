import Link from 'next/link';


// export const metadata: Metadata = {
//   title: 'Studio Documentation – ContractSpec',
//   description:
//     'Official ContractSpec Studio documentation. Jump into getting started, visual builder, deployments, BYOK, and integration guides.',
// };

const sections = [
  {
    title: '1. Getting started',
    body: 'Provision your Studio workspace, create a project, and run the first deployment.',
    href: '/docs/studio/getting-started',
  },
  {
    title: '2. Visual builder',
    body: 'Learn the canvas controls, component palette, and spec validation workflow.',
    href: '/docs/studio/visual-builder',
  },
  {
    title: '3. Deployments',
    body: 'Switch between shared and dedicated environments, monitor health, and roll back safely.',
    href: '/docs/studio/deployments',
  },
  {
    title: '4. BYOK security',
    body: 'Configure your vault, rotate keys, and audit credential access.',
    href: '/docs/studio/byok',
  },
  {
    title: '5. Integration hub',
    body: 'Connect third-party providers, sync data, and index knowledge sources.',
    href: '/docs/studio/integrations',
  },
];

export default function StudioDocsLanding() {
  return (
    <main className="space-y-16 py-16">
      <section className="section-padding">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Studio docs
        </p>
        <h1 className="mt-4 text-4xl font-bold">
          Everything you need to run Studio.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl text-lg">
          ContractSpec Studio pairs a visual builder with managed
          infrastructure. These guides keep teams aligned—especially when
          engineers and operators share the same console.
        </p>
      </section>
      <section className="section-padding grid gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card-subtle group space-y-2 p-6 transition hover:border-violet-500/40"
          >
            <h2 className="text-xl font-semibold group-hover:text-violet-400">
              {section.title}
            </h2>
            <p className="text-muted-foreground text-sm">{section.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
