'use client';

import { useState } from 'react';
import { CrmPipelineBoard } from './CrmPipelineBoard';

type Tab = 'pipeline' | 'contacts' | 'companies' | 'tasks';

export function CrmDashboard() {
  const [tab, setTab] = useState<Tab>('pipeline');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'companies', label: 'Companies' },
    { id: 'tasks', label: 'Tasks' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Pipeline', value: '$324K', change: '+12%' },
          { label: 'Deals Won', value: '23', change: '+5' },
          { label: 'Win Rate', value: '34%', change: '+2%' },
          { label: 'Avg Deal Size', value: '$14.1K', change: '+8%' },
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
              <span className="text-sm text-green-600 dark:text-green-400">
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
        {tab === 'pipeline' && <CrmPipelineBoard />}
        {tab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Contacts</h3>
              <button
                type="button"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
              >
                Add Contact
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: 'John Smith',
                  company: 'TechCorp Inc',
                  email: 'john@techcorp.com',
                  deals: 3,
                },
                {
                  name: 'Sarah Johnson',
                  company: 'StartupXYZ',
                  email: 'sarah@startupxyz.com',
                  deals: 1,
                },
                {
                  name: 'Michael Chen',
                  company: 'MegaBank',
                  email: 'mchen@megabank.com',
                  deals: 2,
                },
              ].map((contact, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      {contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {contact.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {contact.email}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {contact.deals} deals
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'companies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Companies</h3>
              <button
                type="button"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
              >
                Add Company
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: 'TechCorp Inc',
                  industry: 'Technology',
                  size: '500-1000',
                  deals: 5,
                  value: '$245K',
                },
                {
                  name: 'MegaBank',
                  industry: 'Finance',
                  size: '10000+',
                  deals: 3,
                  value: '$180K',
                },
                {
                  name: 'RetailCo',
                  industry: 'Retail',
                  size: '1000-5000',
                  deals: 2,
                  value: '$67K',
                },
                {
                  name: 'HealthPlus',
                  industry: 'Healthcare',
                  size: '100-500',
                  deals: 1,
                  value: '$18K',
                },
              ].map((company, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <h4 className="font-semibold">{company.name}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {company.industry} · {company.size} employees
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span>{company.deals} deals</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      {company.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <button
                type="button"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
              >
                Add Task
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  title: 'Follow up with John Smith',
                  deal: 'Enterprise License',
                  due: 'Today',
                  priority: 'high',
                },
                {
                  title: 'Send proposal to MegaBank',
                  deal: 'Consulting Package',
                  due: 'Tomorrow',
                  priority: 'high',
                },
                {
                  title: 'Schedule demo call',
                  deal: 'Platform Migration',
                  due: 'This week',
                  priority: 'medium',
                },
                {
                  title: 'Update contract terms',
                  deal: 'Support Contract',
                  due: 'Next week',
                  priority: 'low',
                },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {task.deal}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {task.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

