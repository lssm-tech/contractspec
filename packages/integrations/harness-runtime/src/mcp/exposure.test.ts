import { describe, expect, it } from "bun:test";
import { buildHarnessMcpSurface } from "./exposure";

describe("buildHarnessMcpSurface", () => {
  it("exposes harness tools and resources", () => {
    const surface = buildHarnessMcpSurface();
    expect(surface.tools.map((tool) => tool.operationKey)).toContain(
      "harness.run.start",
    );
    expect(surface.resources.map((resource) => resource.uriTemplate)).toContain(
      "harness://runs/{runId}",
    );
  });
});
