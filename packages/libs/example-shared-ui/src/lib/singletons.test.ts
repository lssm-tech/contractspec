import { describe, expect, test } from 'bun:test';
import {
	registerTemplateComponents,
	templateComponentRegistry,
} from './component-registry';
import { TemplateRuntimeContext } from './runtime-context';

const TEMPLATE_RUNTIME_CONTEXT_KEY = Symbol.for(
	'@contractspec/lib.example-shared-ui/template-runtime-context'
);
const TEMPLATE_COMPONENT_REGISTRY_KEY = Symbol.for(
	'@contractspec/lib.example-shared-ui/template-component-registry'
);

const DummyComponent = () => null;

describe('@contractspec/lib.example-shared-ui singletons', () => {
	test('stores TemplateRuntimeContext on globalThis and reuses it', async () => {
		const runtimeContextStore = globalThis as Record<PropertyKey, unknown>;
		const runtimeContextModule = await import('./runtime-context');

		expect(runtimeContextStore[TEMPLATE_RUNTIME_CONTEXT_KEY]).toBe(
			TemplateRuntimeContext
		);
		expect(runtimeContextModule.TemplateRuntimeContext).toBe(
			TemplateRuntimeContext
		);
	});

	test('stores TemplateComponentRegistry on globalThis and reuses registrations', async () => {
		const registryStore = globalThis as Record<PropertyKey, unknown>;
		const registryModule = await import('./component-registry');
		const templateId = `singleton-test-${Date.now()}`;
		const registration = {
			list: DummyComponent,
			detail: DummyComponent,
		};

		registerTemplateComponents(templateId, registration);

		expect(registryStore[TEMPLATE_COMPONENT_REGISTRY_KEY]).toBe(
			templateComponentRegistry
		);
		expect(registryModule.templateComponentRegistry).toBe(
			templateComponentRegistry
		);
		expect(registryModule.templateComponentRegistry.get(templateId)).toBe(
			registration
		);
	});
});
