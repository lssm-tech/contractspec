'use client';

import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@contractspec/lib.design-system';

interface StudioSignupSectionProps {
  variant?: 'default' | 'compact';
}

const studioUrl = 'https://www.contractspec.studio';
const studioDocsUrl = 'https://www.contractspec.studio/docs';

export function StudioSignupSection({
  variant = 'default',
}: StudioSignupSectionProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      id="studio-signup"
      className={isCompact ? 'space-y-4' : 'card-subtle space-y-6 p-8'}
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
          <Rocket size={14} className="text-violet-300" />
          <span className="text-sm font-medium text-violet-300">
            ContractSpec Studio
          </span>
        </div>
        <h2 className={isCompact ? 'text-xl font-bold' : 'text-2xl font-bold'}>
          Try ContractSpec Studio
        </h2>
        <p className="text-muted-foreground text-sm">
          The AI-powered product decision engine that turns product signals into
          spec-first deliverables.
        </p>
        <p className="text-muted-foreground text-xs">
          Evidence -&gt; Correlation -&gt; Decision -&gt; Change -&gt; Export
          -&gt; Check -&gt; Notify -&gt; Autopilot
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href={studioUrl}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={studioDocsUrl}>Read Studio Docs</Link>
        </Button>
      </div>
    </div>
  );
}
