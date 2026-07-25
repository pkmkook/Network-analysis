import { describe, expect, it } from "vitest";
import {
  autoDetectMapping,
  buildDataQualityReport,
  standardizeRows,
} from "@/utils/fileParsers";

describe("fileParsers", () => {
  it("can auto-detect common Chinese headers", () => {
    const mapping = autoDetectMapping([
      "香港行政区",
      "下载速度_Mbps",
      "网络时延_ms",
      "主要网络质量问题",
      "用户满意度",
      "是否提交投诉",
    ]);

    expect(mapping.district).toBe("香港行政区");
    expect(mapping.downloadMbps).toBe("下载速度_Mbps");
    expect(mapping.latencyMs).toBe("网络时延_ms");
    expect(mapping.issueType).toBe("主要网络质量问题");
  });

  it("can standardize rows and infer complaint status when missing", () => {
    const rows = [
      {
        区域: "中西区",
        下载速度: "48.6",
        时延: "31",
        问题类型: "网速慢",
        满意度: "不满意",
      },
    ];
    const mapping = autoDetectMapping(Object.keys(rows[0]));
    const standardized = standardizeRows(rows, mapping);
    const report = buildDataQualityReport(rows, Object.keys(rows[0]), mapping, standardized);

    expect(standardized[0].district).toBe("中西区");
    expect(standardized[0].downloadMbps).toBe(48.6);
    expect(standardized[0].complaint).toBe("是");
    expect(report.missingCriticalFields).toContain("网络制式");
  });
});
