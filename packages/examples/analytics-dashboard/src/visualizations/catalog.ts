import type {
  VisualizationRef,
  VisualizationSpec,
} from '@contractspec/lib.contracts-spec/visualizations';
import { VisualizationRegistry } from '@contractspec/lib.contracts-spec/visualizations';
import {
  ChannelMixVisualization,
  EngagementHeatmapVisualization,
  ConversionFunnelVisualization,
  AccountCoverageGeoVisualization,
} from './specs.breakdown';
import {
  RevenueMetricVisualization,
  RevenueTrendVisualization,
  RegionalRevenueVisualization,
  RetentionAreaVisualization,
  PipelineScatterVisualization,
} from './specs.performance';

export const AnalyticsVisualizationSpecs = [
  RevenueMetricVisualization,
  RevenueTrendVisualization,
  RegionalRevenueVisualization,
  RetentionAreaVisualization,
  PipelineScatterVisualization,
  ChannelMixVisualization,
  EngagementHeatmapVisualization,
  ConversionFunnelVisualization,
  AccountCoverageGeoVisualization,
] as const;

export const AnalyticsVisualizationRegistry = new VisualizationRegistry(
  [...AnalyticsVisualizationSpecs]
);

export const AnalyticsVisualizationRefs = AnalyticsVisualizationSpecs.map((spec) =>
  refOf(spec)
);

export const AnalyticsVisualizationSpecMap = new Map(
  AnalyticsVisualizationSpecs.map((spec) => [visualizationRefKey(spec.meta), spec])
);

export const AnalyticsVisualizationSampleData: Record<string, unknown> = {
  [visualizationRefKey(RevenueMetricVisualization.meta)]: {
    data: [
      { period: '2025-11-01', totalRevenue: 112000, priorRevenue: 103000 },
      { period: '2025-12-01', totalRevenue: 119000, priorRevenue: 110000 },
      { period: '2026-01-01', totalRevenue: 126500, priorRevenue: 116000 },
      { period: '2026-02-01', totalRevenue: 133000, priorRevenue: 124000 },
      { period: '2026-03-01', totalRevenue: 145500, priorRevenue: 133000 },
    ],
  },
  [visualizationRefKey(RevenueTrendVisualization.meta)]: {
    data: [
      { date: '2025-11-01', revenue: 112000 },
      { date: '2025-12-01', revenue: 119000 },
      { date: '2026-01-01', revenue: 126500 },
      { date: '2026-02-01', revenue: 133000 },
      { date: '2026-03-01', revenue: 145500 },
    ],
  },
  [visualizationRefKey(RegionalRevenueVisualization.meta)]: {
    data: [
      { region: 'North America', revenue: 210000 },
      { region: 'EMEA', revenue: 174000 },
      { region: 'APAC', revenue: 132000 },
      { region: 'LATAM', revenue: 88000 },
    ],
  },
  [visualizationRefKey(RetentionAreaVisualization.meta)]: {
    data: [
      { week: 'Week 1', retentionRate: 0.71 },
      { week: 'Week 2', retentionRate: 0.66 },
      { week: 'Week 3', retentionRate: 0.62 },
      { week: 'Week 4', retentionRate: 0.58 },
      { week: 'Week 5', retentionRate: 0.55 },
      { week: 'Week 6', retentionRate: 0.53 },
    ],
  },
  [visualizationRefKey(PipelineScatterVisualization.meta)]: {
    data: [
      { cycleDays: 18, winRate: 0.31, arr: 82000 },
      { cycleDays: 26, winRate: 0.44, arr: 65000 },
      { cycleDays: 33, winRate: 0.27, arr: 91000 },
      { cycleDays: 14, winRate: 0.56, arr: 47000 },
      { cycleDays: 21, winRate: 0.48, arr: 59000 },
      { cycleDays: 39, winRate: 0.22, arr: 114000 },
    ],
  },
  [visualizationRefKey(ChannelMixVisualization.meta)]: {
    data: [
      { channel: 'Direct', sessions: 4200 },
      { channel: 'Organic Search', sessions: 3600 },
      { channel: 'Paid Search', sessions: 2100 },
      { channel: 'Partner', sessions: 1400 },
      { channel: 'Referral', sessions: 900 },
    ],
  },
  [visualizationRefKey(EngagementHeatmapVisualization.meta)]: {
    data: [
      { weekday: 'Mon', timeBand: '09:00', engagementScore: 74 },
      { weekday: 'Mon', timeBand: '13:00', engagementScore: 82 },
      { weekday: 'Tue', timeBand: '09:00', engagementScore: 69 },
      { weekday: 'Tue', timeBand: '13:00', engagementScore: 88 },
      { weekday: 'Wed', timeBand: '09:00', engagementScore: 77 },
      { weekday: 'Wed', timeBand: '13:00', engagementScore: 91 },
      { weekday: 'Thu', timeBand: '09:00', engagementScore: 72 },
      { weekday: 'Thu', timeBand: '13:00', engagementScore: 86 },
      { weekday: 'Fri', timeBand: '09:00', engagementScore: 65 },
      { weekday: 'Fri', timeBand: '13:00', engagementScore: 79 },
    ],
  },
  [visualizationRefKey(ConversionFunnelVisualization.meta)]: {
    data: [
      { stage: 'Visited Site', users: 12000 },
      { stage: 'Started Trial', users: 4200 },
      { stage: 'Activated Workspace', users: 2400 },
      { stage: 'Requested Demo', users: 980 },
      { stage: 'Closed Won', users: 310 },
    ],
  },
  [visualizationRefKey(AccountCoverageGeoVisualization.meta)]: {
    data: [
      { city: 'Paris', latitude: 48.8566, longitude: 2.3522, accounts: 48 },
      { city: 'London', latitude: 51.5072, longitude: -0.1276, accounts: 62 },
      { city: 'New York', latitude: 40.7128, longitude: -74.006, accounts: 71 },
      { city: 'Toronto', latitude: 43.6532, longitude: -79.3832, accounts: 36 },
      { city: 'Singapore', latitude: 1.3521, longitude: 103.8198, accounts: 29 },
    ],
  },
};

export function refOf(spec: VisualizationSpec): VisualizationRef {
  return { key: spec.meta.key, version: spec.meta.version };
}

export function visualizationRefKey(
  ref: Pick<VisualizationRef, 'key' | 'version'>
) {
  return `${ref.key}.v${ref.version}`;
}
