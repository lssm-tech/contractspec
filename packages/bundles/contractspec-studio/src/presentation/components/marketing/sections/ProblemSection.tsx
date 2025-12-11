import * as React from 'react';
import { IconGridSection, type IconGridItem } from './IconGridSection';
import { AlertTriangle, Layers, RefreshCw, XCircle } from 'lucide-react';

const problemItems: IconGridItem[] = [
  {
    icon: AlertTriangle,
    title: "Can't enforce invariants",
    description:
      'AI-generated code drifts from business rules over time. No source of truth means no safety.',
    iconClassName: 'text-red-400',
  },
  {
    icon: Layers,
    title: 'Multi-surface chaos',
    description:
      'API, DB, UI, and events get out of sync. One change breaks three surfaces.',
    iconClassName: 'text-orange-400',
  },
  {
    icon: RefreshCw,
    title: 'Hallucinated refactors',
    description:
      'AI "improvements" introduce subtle bugs and break contracts you didn’t know existed.',
    iconClassName: 'text-amber-400',
  },
  {
    icon: XCircle,
    title: 'Unmaintainable spaghetti',
    description:
      'Teams ship fast initially, then spend months untangling AI-generated chaos.',
    iconClassName: 'text-red-400',
  },
];

export function ProblemSection() {
  return (
    <IconGridSection
      tone="muted"
      columns={4}
      eyebrow="The Problem"
      title="AI agents write code fast. Then the chaos begins."
      subtitle='In 2025, "vibe coding" and AI agents generate enormous amounts of code. But they have critical limitations that destroy long-term maintainability.'
      items={problemItems}
    />
  );
}
