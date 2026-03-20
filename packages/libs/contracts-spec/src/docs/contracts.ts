import type { DataViewRegistry } from '../data-views';
import type { EventRegistry } from '../events';
import type { FormRegistry } from '../forms';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import { DocsGenerateCommand, DocsPublishCommand } from './commands';
import { DocsGeneratedEvent, DocsPublishedEvent } from './events';
import { DocsSearchForm } from './forms';
import {
	DocsLayoutPresentation,
	DocsReferencePagePresentation,
} from './presentations/index';
import { ContractReferenceQuery, DocsIndexQuery } from './queries';
import {
	ContractReferenceDataView,
	DocsIndexDataView,
	ExampleCatalogDataView,
} from './views';

export const docsOperationContracts = {
	DocsIndexQuery,
	ContractReferenceQuery,
	DocsGenerateCommand,
	DocsPublishCommand,
};

export const docsEventContracts = {
	DocsGeneratedEvent,
	DocsPublishedEvent,
};

export const docsPresentationContracts = {
	DocsLayoutPresentation,
	DocsReferencePagePresentation,
};

export const docsFormContracts = {
	DocsSearchForm,
};

export const docsDataViewContracts = {
	DocsIndexDataView,
	ContractReferenceDataView,
	ExampleCatalogDataView,
};

export function registerDocsOperations(registry: OperationSpecRegistry) {
	return registry
		.register(DocsIndexQuery)
		.register(ContractReferenceQuery)
		.register(DocsGenerateCommand)
		.register(DocsPublishCommand);
}

export function registerDocsEvents(registry: EventRegistry) {
	return registry.register(DocsGeneratedEvent).register(DocsPublishedEvent);
}

export function registerDocsPresentations(registry: PresentationRegistry) {
	return registry
		.register(DocsLayoutPresentation)
		.register(DocsReferencePagePresentation);
}

export function registerDocsForms(registry: FormRegistry) {
	return registry.register(DocsSearchForm);
}

export function registerDocsDataViews(registry: DataViewRegistry) {
	return registry
		.register(DocsIndexDataView)
		.register(ContractReferenceDataView)
		.register(ExampleCatalogDataView);
}
