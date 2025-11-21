import type { ExperimentAssignment, MetricSample } from '../types';

export interface TrackerStore {
  saveAssignment(assignment: ExperimentAssignment): Promise<void>;
  saveSample(sample: MetricSample): Promise<void>;
  listAssignments(experimentKey: string): Promise<ExperimentAssignment[]>;
  listSamples(experimentKey: string, metric: string): Promise<MetricSample[]>;
}

export class InMemoryTrackerStore implements TrackerStore {
  private readonly assignments: ExperimentAssignment[] = [];
  private readonly samples: MetricSample[] = [];

  async saveAssignment(assignment: ExperimentAssignment): Promise<void> {
    this.assignments.push(assignment);
  }

  async saveSample(sample: MetricSample): Promise<void> {
    this.samples.push(sample);
  }

  async listAssignments(
    experimentKey: string
  ): Promise<ExperimentAssignment[]> {
    return this.assignments.filter(
      (assignment) => assignment.experimentKey === experimentKey
    );
  }

  async listSamples(
    experimentKey: string,
    metric: string
  ): Promise<MetricSample[]> {
    return this.samples.filter(
      (sample) =>
        sample.experimentKey === experimentKey && sample.metric === metric
    );
  }
}

export class ExperimentTracker {
  constructor(private readonly store: TrackerStore) {}

  async recordAssignment(assignment: ExperimentAssignment) {
    await this.store.saveAssignment(assignment);
  }

  async recordSample(sample: MetricSample) {
    await this.store.saveSample(sample);
  }

  async getAssignments(experimentKey: string) {
    return this.store.listAssignments(experimentKey);
  }

  async getSamples(experimentKey: string, metric: string) {
    return this.store.listSamples(experimentKey, metric);
  }
}
