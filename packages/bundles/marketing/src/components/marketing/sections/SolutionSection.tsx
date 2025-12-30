import * as React from 'react';
import { IconGridSection, type IconGridItem } from './IconGridSection';
import { FileCode, Layers, RefreshCw, Shield } from 'lucide-react';

const solutionItems: IconGridItem[] = [
  {
    icon: FileCode,
    title: 'Canonical Source of Truth',
    description:
      'Contracts define what the system should do, not just what it does. AI agents read specs, not implementations.',
    iconClassName: 'text-emerald-400',
  },
  {
    icon: Layers,
    title: 'Multi-Surface Consistency',
    description:
      'One spec generates API, DB, UI, events, and MCP tools. All surfaces stay in sync because they share the same source.',
    iconClassName: 'text-blue-400',
  },
  {
    icon: RefreshCw,
    title: 'Safe Regeneration',
    description:
      'Regenerate code anytime without fear. Specs enforce invariants. Breaking changes caught at compile time.',
    iconClassName: 'text-violet-400',
  },
  {
    icon: Shield,
    title: 'AI Governance',
    description:
      'Constrain what AI agents can change. Enforce contracts they must respect. Flag violations automatically.',
    iconClassName: 'text-pink-400',
  },
];

export function SolutionSection() {
  return (
    <IconGridSection
      tone="default"
      columns={4}
      eyebrow="The Solution"
      title="ContractSpec: The safety layer for AI-coded systems"
      subtitle="Define contracts once. Generate consistent code across all surfaces. Regenerate safely anytime. No lock-in."
      items={solutionItems}
    />
  );
}
