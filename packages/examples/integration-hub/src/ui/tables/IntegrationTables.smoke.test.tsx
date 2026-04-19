import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type {
	Connection,
	SyncConfig,
} from '../../handlers/integration.handlers';
import { ConnectionsTable, SyncConfigsTable } from './IntegrationTables';

const CONNECTIONS: Connection[] = [
	{
		id: 'conn-1',
		integrationId: 'int-1',
		name: 'Salesforce Production',
		status: 'CONNECTED',
		credentials: { auth: 'oauth2' },
		config: { region: 'us-east-1' },
		lastSyncAt: new Date('2024-05-01T12:30:00Z'),
		createdAt: new Date('2024-04-01T10:00:00Z'),
		updatedAt: new Date('2024-05-01T12:30:00Z'),
	},
	{
		id: 'conn-2',
		integrationId: 'int-2',
		name: 'HubSpot Sandbox',
		status: 'PENDING',
		config: { region: 'eu-west-1' },
		lastSyncAt: new Date('2024-05-02T09:00:00Z'),
		createdAt: new Date('2024-04-03T10:00:00Z'),
		updatedAt: new Date('2024-05-02T09:00:00Z'),
	},
	{
		id: 'conn-3',
		integrationId: 'int-3',
		name: 'Stripe Billing',
		status: 'ERROR',
		config: { retries: 2 },
		errorMessage: 'API timeout during refresh',
		createdAt: new Date('2024-04-04T10:00:00Z'),
		updatedAt: new Date('2024-05-03T09:00:00Z'),
	},
	{
		id: 'conn-4',
		integrationId: 'int-4',
		name: 'Zendesk Support',
		status: 'DISCONNECTED',
		createdAt: new Date('2024-04-05T10:00:00Z'),
		updatedAt: new Date('2024-05-04T09:00:00Z'),
	},
];

const SYNC_CONFIGS: SyncConfig[] = [
	{
		id: 'sync-1',
		connectionId: 'conn-1',
		name: 'Accounts Sync',
		sourceEntity: 'Account',
		targetEntity: 'WorkspaceAccount',
		frequency: 'HOURLY',
		status: 'ACTIVE',
		lastRunAt: new Date('2024-05-01T12:00:00Z'),
		lastRunStatus: 'SUCCESS',
		recordsSynced: 1200,
		createdAt: new Date('2024-04-10T10:00:00Z'),
		updatedAt: new Date('2024-05-01T12:00:00Z'),
	},
];

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://sandbox.contractspec.local/sandbox?template=integration-hub',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	const encodeURIComponentFromGlobal =
		globalThis.encodeURIComponent.bind(globalThis);
	const decodeURIComponentFromGlobal =
		globalThis.decodeURIComponent.bind(globalThis);
	Object.assign(windowInstance, {
		encodeURIComponent: encodeURIComponentFromGlobal,
		decodeURIComponent: decodeURIComponentFromGlobal,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		location: windowInstance.location,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		DocumentFragment: windowInstance.DocumentFragment,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

async function render(ui: ReactNode) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(ui);
	});

	return { container, root };
}

describe('Integration tables', () => {
	test('connections table renders the shared table surface', async () => {
		const { container } = await render(
			<ConnectionsTable connections={CONNECTIONS} />
		);

		expect(container.textContent).toContain('Connections');
		expect(container.textContent).toContain('4 total connections');
		expect(container.textContent).toContain('Show Error Column');
		expect(container.textContent).toContain(
			'Affichage de 1 à 3 sur 4 résultats'
		);
	});

	test('sync configs table renders the shared table surface', async () => {
		const { container } = await render(
			<SyncConfigsTable syncConfigs={SYNC_CONFIGS} />
		);

		expect(container.textContent).toContain('Sync Configs');
		expect(container.textContent).toContain('Accounts Sync');
		expect(container.textContent).toContain('Show Last Run');
	});
});
