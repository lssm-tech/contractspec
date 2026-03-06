import type { CapabilityRegistry } from '../capabilities';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import type { DataViewRegistry } from '../data-views';
import type { FormRegistry } from '../forms';
import {
  BenchmarkIngestCommand,
  BenchmarkRunCustomCommand,
  RankingRefreshCommand,
} from './commands';
import {
  ProviderRankingGetQuery,
  BenchmarkResultsListQuery,
  ModelProfileGetQuery,
} from './queries';
import {
  BenchmarkIngestedEvent,
  BenchmarkCustomCompletedEvent,
  RankingUpdatedEvent,
} from './events';
import { ProviderRankingCapability } from './capabilities';
import {
  ProviderRankingsDataView,
  BenchmarkResultsDataView,
} from './views';
import {
  BenchmarkIngestForm,
  BenchmarkRunCustomForm,
} from './forms';
import { ModelComparisonPresentation } from './presentations';

export const providerRankingOperationContracts = {
  BenchmarkIngestCommand,
  BenchmarkRunCustomCommand,
  RankingRefreshCommand,
  ProviderRankingGetQuery,
  BenchmarkResultsListQuery,
  ModelProfileGetQuery,
};

export const providerRankingEventContracts = {
  BenchmarkIngestedEvent,
  BenchmarkCustomCompletedEvent,
  RankingUpdatedEvent,
};

export const providerRankingCapabilityContracts = {
  ProviderRankingCapability,
};

export const providerRankingDataViewContracts = {
  ProviderRankingsDataView,
  BenchmarkResultsDataView,
};

export const providerRankingFormContracts = {
  BenchmarkIngestForm,
  BenchmarkRunCustomForm,
};

export const providerRankingPresentationContracts = {
  ModelComparisonPresentation,
};

export function registerProviderRankingOperations(registry: OperationSpecRegistry) {
  return registry
    .register(BenchmarkIngestCommand)
    .register(BenchmarkRunCustomCommand)
    .register(RankingRefreshCommand)
    .register(ProviderRankingGetQuery)
    .register(BenchmarkResultsListQuery)
    .register(ModelProfileGetQuery);
}

export function registerProviderRankingEvents(registry: EventRegistry) {
  return registry
    .register(BenchmarkIngestedEvent)
    .register(BenchmarkCustomCompletedEvent)
    .register(RankingUpdatedEvent);
}

export function registerProviderRankingCapabilities(registry: CapabilityRegistry) {
  return registry.register(ProviderRankingCapability);
}

export function registerProviderRankingDataViews(registry: DataViewRegistry) {
  return registry
    .register(ProviderRankingsDataView)
    .register(BenchmarkResultsDataView);
}

export function registerProviderRankingForms(registry: FormRegistry) {
  return registry
    .register(BenchmarkIngestForm)
    .register(BenchmarkRunCustomForm);
}

export function registerProviderRankingPresentations(registry: PresentationRegistry) {
  return registry.register(ModelComparisonPresentation);
}
