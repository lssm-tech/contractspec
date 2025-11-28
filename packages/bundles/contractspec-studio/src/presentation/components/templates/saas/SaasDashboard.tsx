'use client';

import { useState } from 'react';
import { SaasProjectList } from './SaasProjectList';
import { SaasSettingsPanel } from './SaasSettingsPanel';

type Tab = 'projects' | 'members' | 'settings' | 'billing';

export function SaasDashboard() {
  const [tab, setTab] = useState<Tab>('projects');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'members', label: 'Team' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <div className="space-y-6">
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
        {tab === 'projects' && <SaasProjectList />}
        {tab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <button
                type="button"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
              >
                Invite Member
              </button>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Alice Chen', role: 'Owner', email: 'alice@acme.com' },
                { name: 'Bob Smith', role: 'Admin', email: 'bob@acme.com' },
                {
                  name: 'Carol Johnson',
                  role: 'Member',
                  email: 'carol@acme.com',
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'settings' && <SaasSettingsPanel />}
        {tab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing & Usage</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Current Plan', value: 'Professional', sub: '$49/mo' },
                { label: 'Usage This Month', value: '2,847', sub: 'API calls' },
                { label: 'Next Invoice', value: '$49.00', sub: 'Due Mar 1' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
