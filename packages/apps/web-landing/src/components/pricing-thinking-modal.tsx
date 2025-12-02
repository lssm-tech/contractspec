'use client';

import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lssm/lib.ui-kit-web/ui/dialog';
import { Button } from '@lssm/lib.ui-kit-web/ui/button';
import { PRICING_EXAMPLES } from '@/lib/pricing-examples';

interface PricingTier {
  tag: string;
  title: string;
  priceLine: string;
  bullets: string[];
  note: string;
}

interface UsageMetric {
  name: string;
  freeTier: string;
  beyond: string;
}

const pricingTiers: PricingTier[] = [
  {
    tag: 'Planned',
    title: 'Free',
    priceLine: 'For hobbyists and pre-PMF teams',
    bullets: [
      '1 active project',
      'Small spec size',
      `Example: ~${PRICING_EXAMPLES.free.regenerationsPerMonth} free regenerations per month`,
      `Example: ~${PRICING_EXAMPLES.free.aiActionsPerMonth} free AI agent actions per month`,
      'Unlimited collaborators',
    ],
    note: 'Good enough to build and launch a real product before paying.',
  },
  {
    tag: 'Planned',
    title: 'Builder',
    priceLine: 'Usage-based, for solo builders and small teams',
    bullets: [
      'More projects',
      `More monthly regenerations included (e.g. ${PRICING_EXAMPLES.builder.regenerationsPerMonthHint})`,
      `More AI agent actions included (e.g. ${PRICING_EXAMPLES.builder.aiActionsPerMonthHint})`,
      'Pay-as-you-go for extra regenerations and AI',
      'Basic environments (dev / prod)',
    ],
    note: 'Pay for how fast and how often you evolve your system, not for seats.',
  },
  {
    tag: 'Planned',
    title: 'Team & Platform',
    priceLine: 'For teams standardizing on ContractSpec',
    bullets: [
      'Multiple projects and environments',
      'Higher regeneration and AI action limits',
      'Cheaper overages as you scale',
      'Advanced RBAC and governance',
      'SSO, audit trails, and longer retention',
    ],
    note: 'For platform teams using ContractSpec as infra for multiple apps.',
  },
];

const usageMetrics: UsageMetric[] = [
  {
    name: 'Regenerations',
    freeTier: `Free tier: e.g. ~${PRICING_EXAMPLES.free.regenerationsPerMonth} regenerations / month`,
    beyond: 'Beyond: pay per additional regeneration, with volume discounts.',
  },
  {
    name: 'AI agent actions',
    freeTier: `Free tier: e.g. ~${PRICING_EXAMPLES.free.aiActionsPerMonth} AI agent actions / month`,
    beyond: 'Beyond: pay-as-you-go for extra AI usage.',
  },
  {
    name: 'Projects',
    freeTier: `Free tier: ${PRICING_EXAMPLES.free.projects} project`,
    beyond: 'Builder / Team: more projects included; extra projects available as you scale.',
  },
];

interface PricingThinkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyClick?: () => void;
}

export function PricingThinkingModal({
  open,
  onOpenChange,
  onApplyClick,
}: PricingThinkingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tentative pricing (work in progress)</DialogTitle>
          <DialogDescription>
            We're still in design-partner mode. This is a draft of how we
            expect pricing to look once we open public access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* High-level tiers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Draft
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                Subject to change
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.title}
                  className="card-subtle relative space-y-4 p-6"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-muted border border-border px-2 py-0.5 text-xs font-medium">
                    {tier.tag}
                  </div>
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl font-bold">{tier.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {tier.priceLine}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {tier.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex gap-2 text-sm"
                      >
                        <CheckCircle
                          size={14}
                          className="mt-0.5 shrink-0 text-violet-400"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground text-xs italic">
                    {tier.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage-based detail */}
          <div className="space-y-4 border-t border-border pt-6">
            <div>
              <h3 className="text-lg font-bold">
                Usage-based, with a generous free tier
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Inspired by products like PostHog, we plan to keep a generous
                free tier on all plans, then charge based on actual usage:
                regenerations, AI agent actions, and the number of projects you
                run on ContractSpec.
              </p>
              <p className="text-muted-foreground mt-3 text-xs italic">
                Free tier limits are intentionally small but useful: enough to
                try the agent and regenerate a real project, not enough to run
                a full team's workload for free.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {usageMetrics.map((metric) => (
                <div key={metric.name} className="card-subtle space-y-2 p-4">
                  <h4 className="font-semibold text-sm">{metric.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {metric.freeTier}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {metric.beyond}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer / Disclaimer */}
          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-muted-foreground text-xs">
              These numbers are examples only. Final pricing and limits will
              evolve as we learn from design partners.
            </p>
            <p className="text-muted-foreground text-xs">
              This is a tentative pricing model. We're pre-PMF and pricing is
              still in draft, subject to change based on what we learn.
            </p>
            <p className="text-muted-foreground text-xs">
              Design partners get early access and a founding discount when paid
              plans launch.
            </p>
            {onApplyClick && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onApplyClick();
                }}
                className="w-full"
                variant="outline"
              >
                Apply as a design partner
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

