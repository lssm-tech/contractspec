import { describe, expect, it } from 'bun:test';

import {
	findTransportConfig,
	type IntegrationTransportConfig,
	supportsTransport,
} from './transport';

const transports: IntegrationTransportConfig[] = [
	{ type: 'rest', baseUrl: 'https://api.example.com' },
	{ type: 'mcp', transport: 'http', url: 'https://mcp.example.com' },
	{
		type: 'webhook',
		inbound: {
			signatureHeader: 'x-sig',
			signingAlgorithm: 'hmac-sha256',
		},
	},
	{ type: 'sdk', packageName: '@example/sdk', minVersion: '2.0.0' },
];

describe('findTransportConfig', () => {
	it('should find REST transport by type', () => {
		const config = findTransportConfig(transports, 'rest');
		expect(config).toBeDefined();
		expect(config?.type).toBe('rest');
		expect(config?.baseUrl).toBe('https://api.example.com');
	});

	it('should find MCP transport by type', () => {
		const config = findTransportConfig(transports, 'mcp');
		expect(config).toBeDefined();
		expect(config?.type).toBe('mcp');
		if (config?.type === 'mcp') {
			expect(config.transport).toBe('http');
		}
	});

	it('should find webhook transport by type', () => {
		const config = findTransportConfig(transports, 'webhook');
		expect(config).toBeDefined();
		expect(config?.type).toBe('webhook');
	});

	it('should find SDK transport by type', () => {
		const config = findTransportConfig(transports, 'sdk');
		expect(config).toBeDefined();
		if (config?.type === 'sdk') {
			expect(config.packageName).toBe('@example/sdk');
			expect(config.minVersion).toBe('2.0.0');
		}
	});

	it('should return undefined for missing transport', () => {
		const noWebhook: IntegrationTransportConfig[] = [{ type: 'rest' }];
		expect(findTransportConfig(noWebhook, 'webhook')).toBeUndefined();
	});
});

describe('supportsTransport', () => {
	it('should return true for supported transports', () => {
		expect(supportsTransport(transports, 'rest')).toBe(true);
		expect(supportsTransport(transports, 'mcp')).toBe(true);
		expect(supportsTransport(transports, 'webhook')).toBe(true);
		expect(supportsTransport(transports, 'sdk')).toBe(true);
	});

	it('should return false for unsupported transport', () => {
		const restOnly: IntegrationTransportConfig[] = [{ type: 'rest' }];
		expect(supportsTransport(restOnly, 'mcp')).toBe(false);
	});

	it('should return false for empty transports', () => {
		expect(supportsTransport([], 'rest')).toBe(false);
	});
});
