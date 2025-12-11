import * as React from 'react';
import { IconGridSection } from './IconGridSection';

const steps = [
  {
    step: 1,
    title: 'Pick one module',
    description:
      'Start with one API endpoint, one entity, one surface. No big-bang migration.',
  },
  {
    step: 2,
    title: 'Define the contract',
    description:
      'Write a spec in TypeScript. Just types and Zod schemas you already know.',
  },
  {
    step: 3,
    title: 'Generate & compare',
    description:
      'See what ContractSpec generates. Compare to your existing code. Keep what works.',
  },
  {
    step: 4,
    title: 'Expand gradually',
    description:
      'Add more contracts as you see value. No pressure. No lock-in. Your pace.',
  },
];

export function StepsSection() {
  return (
    <IconGridSection
      tone="default"
      columns={4}
      title="How incremental adoption works"
      padding="comfortable"
      iconRole="listing"
      items={steps.map((item) => ({
        icon: ({ className }) => (
          <div
            className={`bg-primary/15 flex h-10 w-10 items-center justify-center rounded-lg ${className ?? ''}`}
          >
            <span className="text-primary text-sm font-semibold">
              {item.step}
            </span>
          </div>
        ),
        title: item.title,
        description: item.description,
        tone: 'muted',
      }))}
    />
  );
}
