'use client';

import { useState } from 'react';
import { AgentRunList } from './AgentRunList';
import { AgentToolRegistry } from './AgentToolRegistry';

type Tab = 'runs' | 'agents' | 'tools' | 'metrics';

export function AgentDashboard() {
  const [tab, setTab] = useState<Tab>('runs');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'runs', label: 'Runs' },
    { id: 'agents', label: 'Agents' },
    { id: 'tools', label: 'Tools' },
    { id: 'metrics', label: 'Metrics' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Runs', value: '2,847', change: '+124 today' },
          { label: 'Active Agents', value: '12', change: '3 running' },
          { label: 'Token Usage', value: '1.2M', change: 'This month' },
          { label: 'Total Cost', value: '$245', change: 'This month' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{stat.value}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tab === 'runs' && <AgentRunList />}
        {tab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Agents</h3>
              <button
                type="button"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
              >
                Create Agent
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: 'Research Assistant',
                  model: 'gpt-4o',
                  tools: 5,
                  runs: 1247,
                  status: 'active',
                },
                {
                  name: 'Code Reviewer',
                  model: 'claude-3-opus',
                  tools: 3,
                  runs: 892,
                  status: 'active',
                },
                {
                  name: 'Data Analyst',
                  model: 'gpt-4o',
                  tools: 4,
                  runs: 456,
                  status: 'active',
                },
                {
                  name: 'Content Writer',
                  model: 'claude-3-sonnet',
                  tools: 2,
                  runs: 252,
                  status: 'paused',
                },
              ].map((agent, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{agent.name}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {agent.model} · {agent.tools} tools
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        agent.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{agent.runs.toLocaleString()} runs</span>
                    <button
                      type="button"
                      className="text-violet-600 hover:underline dark:text-violet-400"
                    >
                      Configure →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'tools' && <AgentToolRegistry />}
        {tab === 'metrics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Usage Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <h4 className="font-medium">Token Usage by Model</h4>
                <div className="mt-4 space-y-3">
                  {[
                    { model: 'gpt-4o', tokens: 580000, pct: 48 },
                    { model: 'claude-3-opus', tokens: 420000, pct: 35 },
                    { model: 'claude-3-sonnet', tokens: 200000, pct: 17 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm">
                        <span>{item.model}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {(item.tokens / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                        <div
                          className="h-full bg-violet-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <h4 className="font-medium">Tool Invocations</h4>
                <div className="mt-4 space-y-3">
                  {[
                    { tool: 'web_search', count: 15420, pct: 37 },
                    { tool: 'file_reader', count: 12304, pct: 30 },
                    { tool: 'code_interpreter', count: 8932, pct: 21 },
                    { tool: 'database_query', count: 5621, pct: 12 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm">
                        <span className="font-mono">{item.tool}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

