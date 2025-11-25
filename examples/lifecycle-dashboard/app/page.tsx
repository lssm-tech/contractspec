'use client';

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
        name: data.assessment.stageName ?? `Stage ${data.assessment.stage}`,
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

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Running lifecycle assessment…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 space-y-4">
        <p className="text-red-600">Unable to load lifecycle data: {error}</p>
        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={() => runAssessment()}
        >
          Retry
        </button>
      </main>
    );
  }

  if (!card) return null;

  return (
    <main className="p-6 space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-gray-500">Current Stage</div>
        <div className="text-2xl font-semibold">{card.name}</div>
        <p className="text-gray-500">
          Confidence {Math.round(card.confidence * 100)}%
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Recommended Actions</h2>
        {card.recommendation?.actions?.map((action) => (
          <article key={action.id} className="rounded-lg border border-gray-100 p-4">
            <p className="font-medium">{action.title}</p>
            <p className="text-sm text-gray-500">{action.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Next ContractSpec Libraries</h2>
        {card.libraries?.map((lib) => (
          <article key={lib.id} className="rounded-lg border border-gray-100 p-4">
            <p className="font-mono text-sm text-gray-600">{lib.id}</p>
            <p className="text-sm text-gray-500">{lib.description}</p>
          </article>
        )) ?? <p className="text-sm text-gray-500">No suggestions yet.</p>}
      </section>
    </main>
  );
}












