'use client';

/**
 * SaaS Settings Panel - Organization and user settings
 */
import { useState } from 'react';
import { Button } from '@lssm/lib.design-system';

export function SaasSettingsPanel() {
  const [orgName, setOrgName] = useState('Demo Organization');
  const [timezone, setTimezone] = useState('UTC');

  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Organization Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="border-input bg-background mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Default Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="border-input bg-background mt-1 block w-full rounded-md border px-3 py-2"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="default">Save Changes</Button>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', defaultChecked: true },
            { label: 'Usage alerts', defaultChecked: true },
            { label: 'Weekly digest', defaultChecked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
        <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="mb-4 text-sm text-red-600 dark:text-red-300">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            Export Data
          </Button>
          <Button variant="secondary" size="sm">
            Delete Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
