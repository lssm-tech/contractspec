import { describe, expect, it } from "bun:test";
import { createVisualizationModel } from "./visualization";
import type { VisualizationSpec } from "@contractspec/lib.contracts-spec/visualizations";

describe("createVisualizationModel", () => {
  it("normalizes cartesian rows into chart series", () => {
    const spec = createCartesianSpec();

    const model = createVisualizationModel(spec, {
      data: [
        { day: "2026-03-01", revenue: 100 },
        { day: "2026-03-02", revenue: 150 },
      ],
    });

    expect(model.kind).toBe("cartesian");
    expect(model.series[0]?.points).toHaveLength(2);
    expect(model.xAxis?.label).toBe("Day");
  });

  it("builds metric models with current values", () => {
    const model = createVisualizationModel(createMetricSpec(), [
      { mrr: 1200, growth: 0.2 },
    ]);

    expect(model.metric?.value).toBe(1200);
    expect(model.metric?.comparisonValue).toBe(0.2);
  });
});

function createCartesianSpec(): VisualizationSpec {
  return {
    meta: {
      key: "analytics.revenue.trend",
      version: "1.0.0",
      title: "Revenue Trend",
      description: "Revenue trend",
      goal: "Track revenue",
      context: "Dashboard",
      stability: "stable",
      owners: ["platform.analytics"],
      tags: ["analytics"],
    },
    source: {
      primary: { key: "analytics.query.execute", version: "1.0.0" },
      resultPath: "data",
    },
    visualization: {
      kind: "cartesian",
      variant: "line",
      dimensions: [{ key: "day", label: "Day", dataPath: "day", type: "time" }],
      measures: [
        {
          key: "revenue",
          label: "Revenue",
          dataPath: "revenue",
          format: "currency",
        },
      ],
      xDimension: "day",
      yMeasures: ["revenue"],
    },
  };
}

function createMetricSpec(): VisualizationSpec {
  return {
    meta: {
      key: "analytics.mrr",
      version: "1.0.0",
      title: "MRR",
      description: "Monthly recurring revenue",
      goal: "Show MRR",
      context: "Dashboard",
      stability: "stable",
      owners: ["platform.analytics"],
      tags: ["analytics"],
    },
    source: {
      primary: { key: "analytics.query.execute", version: "1.0.0" },
    },
    visualization: {
      kind: "metric",
      measures: [
        { key: "mrr", label: "MRR", dataPath: "mrr", format: "currency" },
        { key: "growth", label: "Growth", dataPath: "growth", format: "percentage" },
      ],
      measure: "mrr",
      comparisonMeasure: "growth",
    },
  };
}
