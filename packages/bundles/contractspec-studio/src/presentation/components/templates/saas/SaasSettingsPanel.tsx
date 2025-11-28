'use client';

import { useState } from 'react';

interface Settings {
  orgName: string;
  timezone: string;
  billingEmail: string;
  plan: 'starter' | 'professional' | 'enterprise';
}

export function SaasSettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    orgName: 'Acme Corp',
    timezone: 'America/New_York',
    billingEmail: 'billing@acme.com',
    plan: 'professional',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Organization Settings</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your organization preferences and billing
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Organization Name
          </label>
          <input
            type="text"
            value={settings.orgName}
            onChange={(e) =>
              setSettings({ ...settings, orgName: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Billing Email
          </label>
          <input
            type="email"
            value={settings.billingEmail}
            onChange={(e) =>
              setSettings({ ...settings, billingEmail: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700"
          />
        </div>

        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <h4 className="font-medium">Current Plan</h4>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              {settings.plan.charAt(0).toUpperCase() + settings.plan.slice(1)}
            </span>
            <button
              type="button"
              className="text-sm text-violet-600 hover:underline dark:text-violet-400"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
