'use client';

import { useState } from 'react';

interface Run {
  id: string;
  agentName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  duration: string;
  tokens: number;
  cost: string;
  steps: number;
}

const SAMPLE_RUNS: Run[] = [
  {
    id: 'run-1',
    agentName: 'Research Assistant',
    status: 'completed',
    startedAt: '2 min ago',
    duration: '45s',
    tokens: 4250,
    cost: '$0.08',
    steps: 8,
  },
  {
    id: 'run-2',
    agentName: 'Code Reviewer',
    status: 'running',
    startedAt: 'Just now',
    duration: '-',
    tokens: 1200,
    cost: '$0.02',
    steps: 3,
  },
  {
    id: 'run-3',
    agentName: 'Data Analyst',
    status: 'completed',
    startedAt: '15 min ago',
    duration: '2m 12s',
    tokens: 12400,
    cost: '$0.25',
    steps: 15,
  },
  {
    id: 'run-4',
    agentName: 'Research Assistant',
    status: 'failed',
    startedAt: '1h ago',
    duration: '1m 3s',
    tokens: 3100,
    cost: '$0.06',
    steps: 5,
  },
  {
    id: 'run-5',
    agentName: 'Content Writer',
    status: 'completed',
    startedAt: '2h ago',
    duration: '3m 45s',
    tokens: 18200,
    cost: '$0.36',
    steps: 12,
  },
];

export function AgentRunList() {
  const [runs] = useState<Run[]>(SAMPLE_RUNS);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Runs</h3>
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
        >
          New Run
        </button>
      </div>

      <div className="space-y-2">
        {runs.map((run) => (
          <div
            key={run.id}
            onClick={() => setSelectedRun(run)}
            className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-violet-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    run.status === 'running'
                      ? 'animate-pulse bg-blue-500'
                      : run.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                />
                <div>
                  <p className="font-medium">{run.agentName}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {run.startedAt} · {run.steps} steps
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{run.duration}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {run.tokens.toLocaleString()} tokens · {run.cost}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRun && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold">
                  {selectedRun.agentName}
                </h4>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    selectedRun.status === 'running'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : selectedRun.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {selectedRun.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Run ID: {selectedRun.id}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRun(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Duration
              </p>
              <p className="font-semibold">{selectedRun.duration}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Tokens</p>
              <p className="font-semibold">
                {selectedRun.tokens.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Steps</p>
              <p className="font-semibold">{selectedRun.steps}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Cost</p>
              <p className="font-semibold">{selectedRun.cost}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Execution Log</p>
            <div className="max-h-32 overflow-y-auto rounded-lg bg-zinc-900 p-3 font-mono text-xs text-green-400">
              <p>→ Starting agent run...</p>
              <p>→ Tool invoked: web_search</p>
              <p>→ Tool completed (1.2s)</p>
              <p>→ Tool invoked: code_interpreter</p>
              <p>→ Tool completed (2.1s)</p>
              <p>→ Generating response...</p>
              <p>→ Run {selectedRun.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
