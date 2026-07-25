import { describe, expect, it } from "vitest";
import { computeAnalyticsSummary, createDefaultFilters, filterRecords } from "@/utils/networkAnalytics";
import { generateDemoDataset } from "@/utils/networkDataset";

describe("networkAnalytics", () => {
  const records = generateDemoDataset(120);

  it("computes a summary from reusable network records", () => {
    const summary = computeAnalyticsSummary(records);

    expect(summary.sampleSize).toBe(120);
    expect(summary.avgDownload).toBeGreaterThan(0);
    expect(summary.districtScores.length).toBeGreaterThan(0);
    expect(summary.issueDistribution[0].value).toBeGreaterThan(0);
    expect(summary.insights.length).toBeGreaterThan(0);
  });

  it("filters by district and network type", () => {
    const targetDistrict = records[0].district;
    const filters = {
      ...createDefaultFilters(),
      district: targetDistrict,
      networkType: "5G",
    };
    const filtered = filterRecords(records, filters);

    expect(filtered.every((item) => item.district === targetDistrict)).toBe(true);
    expect(filtered.every((item) => item.networkType === "5G")).toBe(true);
  });
});
