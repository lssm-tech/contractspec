/**
 * Deterministic snippet for a Next.js App Router page.
 *
 * We keep this as a string so `packages/examples/*` stays design-system-first and
 * avoids raw HTML in runnable application code.
 */
export const lifecycleDashboardNextPageSnippet = `'use client';

import { useEffect, useState } from 'react';

type StageCard = {
  stage: number;
  name: string;
  confidence: number;
  recommendation?: {
    actions: { id: string; title: string; description: string }[];
  };
  libraries?: { id: string; description: string }[];
};

export default function LifecycleDashboardPage() {
  const [card, setCard] = useState<StageCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    void runAssessment();
  }, []);

  async function runAssessment() {
    try {
      setLoading(true);
      setError(undefined);
      const response = await fetch('/api/lifecycle/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: 'demo' }),
      });
      if (!response.ok) throw new Error('Failed assessment');
      const data = await response.json();
      setCard({
        stage: data.assessment.stage,
        name: data.assessment.stageName ?? \`Stage \${data.assessment.stage}\`,
        confidence: data.assessment.confidence,
        recommendation: data.recommendation,
        libraries: data.libraries,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  // Render using your app's design system components in real code.
  return null;
}
`;


