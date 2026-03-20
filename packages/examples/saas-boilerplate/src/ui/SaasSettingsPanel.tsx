'use client';

import { Button } from '@contractspec/lib.design-system';
/**
 * SaaS Settings Panel - Organization and user settings
 */
import { useState } from 'react';

export function SaasSettingsPanel() {
	const [orgName, setOrgName] = useState('Demo Organization');
	const [timezone, setTimezone] = useState('UTC');

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="mb-4 font-semibold text-lg">Organization Settings</h3>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="setting-org-name"
							className="block font-medium text-sm"
						>
							Organization Name
						</label>
						<input
							id="setting-org-name"
							type="text"
							value={orgName}
							onChange={(e) => setOrgName(e.target.value)}
							className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="setting-timezone"
							className="block font-medium text-sm"
						>
							Default Timezone
						</label>
						<select
							id="setting-timezone"
							value={timezone}
							onChange={(e) => setTimezone(e.target.value)}
							className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
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

			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="mb-4 font-semibold text-lg">Notifications</h3>
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
								className="h-4 w-4 rounded border-input"
							/>
							<span className="text-sm">{item.label}</span>
						</label>
					))}
				</div>
			</div>

			<div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
				<h3 className="mb-2 font-semibold text-lg text-red-700 dark:text-red-400">
					Danger Zone
				</h3>
				<p className="mb-4 text-red-600 text-sm dark:text-red-300">
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
