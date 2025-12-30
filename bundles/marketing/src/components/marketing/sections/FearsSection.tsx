import * as React from 'react';
import { CheckCircle, Code, Unlock, Zap } from 'lucide-react';
import { IconGridSection } from './IconGridSection';

const fears = [
  {
    title: '"I already have an app"',
    body: "ContractSpec works with existing codebases. You don't start over — you stabilize incrementally, one module at a time. Start with one API endpoint, one data model, one contract.",
    icon: CheckCircle,
  },
  {
    title: '"Vendor lock-in / losing ownership"',
    body: "You own the generated code. It's standard TypeScript, standard SQL, standard GraphQL. ContractSpec is a compiler — like TypeScript itself. You can eject anytime.",
    icon: Unlock,
  },
  {
    title: '"Adoption cost / learning curve"',
    body: 'Specs are just TypeScript. If you can write z.object({ name: z.string() }), you can write a ContractSpec. No new language, no magic DSL, no YAML.',
    icon: Code,
  },
  {
    title: '"Forced migrations / magical runtime"',
    body: "ContractSpec generates plain code you can read, debug, and modify. There's no proprietary runtime. Migrations are explicit, reversible, and in your control.",
    icon: Zap,
  },
];

export function FearsSection() {
  return (
    <IconGridSection
      tone="muted"
      columns={2}
      eyebrow="We Get It"
      title="Your fears, addressed"
      subtitle="We know what you're thinking. Here's why those concerns don't apply to ContractSpec."
      iconRole="support"
      items={fears.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.body,
        iconClassName: 'text-violet-400',
      }))}
    />
  );
}
