import type {
  AnalyticsSummary,
  DistrictScore,
  DistributionItem,
  Filters,
  HeatmapCell,
  StandardRecord,
} from "@/types/network";

const ALL = "全部";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function rate<T>(items: T[], predicate: (item: T) => boolean) {
  if (items.length === 0) {
    return 0;
  }
  return (items.filter(predicate).length / items.length) * 100;
}

function round(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function distribution(records: StandardRecord[], selector: (record: StandardRecord) => string) {
  const counts = new Map<string, number>();

  records.forEach((record) => {
    const key = selector(record) || "未提供";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function topKey(records: StandardRecord[], selector: (record: StandardRecord) => string) {
  return distribution(records, selector)[0]?.name ?? "无";
}

function topProblemIssue(records: StandardRecord[]) {
  return (
    distribution(records, (record) => record.issueType).find(
      (item) => item.name !== "无明显问题",
    )?.name ?? "无明显问题"
  );
}

function normalizeForScore(value: number, min: number, max: number) {
  if (max === min) {
    return 100;
  }
  return ((value - min) / (max - min)) * 100;
}

function formatDateRange(records: StandardRecord[]) {
  const dates = records
    .map((record) => record.feedbackDate)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  if (dates.length === 0) {
    return "未提供日期";
  }
  return `${dates[0]} 至 ${dates[dates.length - 1]}`;
}

function buildDistrictScores(records: StandardRecord[]): DistrictScore[] {
  const grouped = new Map<string, StandardRecord[]>();

  records.forEach((record) => {
    const key = record.district || "未识别区域";
    grouped.set(key, [...(grouped.get(key) ?? []), record]);
  });

  const roughScores = [...grouped.entries()].map(([district, items]) => ({
    district,
    avgDownload: average(items.map((item) => item.downloadMbps)),
    avgUpload: average(items.map((item) => item.uploadMbps)),
    avgLatency: average(items.map((item) => item.latencyMs)),
    complaintRate: rate(items, (item) => item.complaint === "是"),
    satisfactionRate: rate(
      items,
      (item) => item.satisfaction === "满意" || item.satisfaction === "非常满意",
    ),
    sampleSize: items.length,
    topIssue: topProblemIssue(items),
    repeatedRate: rate(items, (item) => item.repeatedFeedback === "是"),
  }));

  const minDownload = Math.min(...roughScores.map((item) => item.avgDownload), 0);
  const maxDownload = Math.max(...roughScores.map((item) => item.avgDownload), 1);
  const minLatency = Math.min(...roughScores.map((item) => item.avgLatency), 0);
  const maxLatency = Math.max(...roughScores.map((item) => item.avgLatency), 1);
  const minComplaint = Math.min(...roughScores.map((item) => item.complaintRate), 0);
  const maxComplaint = Math.max(...roughScores.map((item) => item.complaintRate), 1);
  const minSatisfaction = Math.min(...roughScores.map((item) => item.satisfactionRate), 0);
  const maxSatisfaction = Math.max(...roughScores.map((item) => item.satisfactionRate), 1);

  return roughScores
    .map((item) => {
      const score =
        normalizeForScore(item.avgDownload, minDownload, maxDownload) * 0.35 +
        (100 - normalizeForScore(item.avgLatency, minLatency, maxLatency)) * 0.25 +
        (100 - normalizeForScore(item.complaintRate, minComplaint, maxComplaint)) * 0.2 +
        normalizeForScore(item.satisfactionRate, minSatisfaction, maxSatisfaction) * 0.2;

      return {
        ...item,
        avgDownload: round(item.avgDownload, 2),
        avgUpload: round(item.avgUpload, 2),
        avgLatency: round(item.avgLatency, 1),
        complaintRate: round(item.complaintRate, 1),
        satisfactionRate: round(item.satisfactionRate, 1),
        repeatedRate: round(item.repeatedRate, 1),
        score: round(score, 1),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function buildHeatmap(records: StandardRecord[]): HeatmapCell[] {
  const districtNames = [...new Set(records.map((record) => record.district))];
  const issueNames = distribution(records, (record) => record.issueType)
    .slice(0, 6)
    .map((item) => item.name);

  return districtNames.flatMap((district) =>
    issueNames.map((issueType) => ({
      row: district,
      column: issueType,
      value: records.filter(
        (record) => record.district === district && record.issueType === issueType,
      ).length,
    })),
  );
}

function buildInsights(
  records: StandardRecord[],
  districtScores: DistrictScore[],
): AnalyticsSummary["insights"] {
  if (records.length === 0 || districtScores.length === 0) {
    return [];
  }

  const bestDistrict = districtScores[0];
  const worstDistrict = districtScores[districtScores.length - 1];
  const worstTime = [...distribution(records, (record) => record.timePeriod)]
    .map((item) => ({
      ...item,
      complaintRate: rate(
        records.filter((record) => record.timePeriod === item.name),
        (record) => record.complaint === "是",
      ),
    }))
    .sort((a, b) => b.complaintRate - a.complaintRate || b.value - a.value)[0];
  const indoorIssueCount = records.filter(
    (record) =>
      (record.scenario === "住宅屋苑" ||
        record.scenario === "写字楼" ||
        record.scenario === "商场") &&
      (record.issueType === "信号弱" || record.issueType === "室内覆盖差"),
  ).length;

  return [
    {
      title: "最佳网络区域",
      description: `${bestDistrict.district} 以 ${bestDistrict.score} 分领先，平均下载 ${bestDistrict.avgDownload} Mbps，满意度 ${bestDistrict.satisfactionRate}%。`,
      tone: "good",
    },
    {
      title: "最需优化区域",
      description: `${worstDistrict.district} 得分最低，主要问题为“${worstDistrict.topIssue}”，投诉率 ${worstDistrict.complaintRate}%。`,
      tone: "warning",
    },
    {
      title: "高峰风险提醒",
      description: `${worstTime?.name ?? "晚高峰"} 的投诉压力最高，建议重点观察高峰时段容量与切网稳定性。`,
      tone: "warning",
    },
    {
      title: "室内覆盖洞察",
      description: `住宅、写字楼和商场场景中共有 ${indoorIssueCount} 条与室内覆盖相关的问题反馈，适合优先纳入补点清单。`,
      tone: "neutral",
    },
  ];
}

export function createDefaultFilters(): Filters {
  return {
    district: ALL,
    scenario: ALL,
    timePeriod: ALL,
    networkType: ALL,
    issueType: ALL,
  };
}

export function filterRecords(records: StandardRecord[], filters: Filters) {
  return records.filter((record) => {
    return (
      (filters.district === ALL || record.district === filters.district) &&
      (filters.scenario === ALL || record.scenario === filters.scenario) &&
      (filters.timePeriod === ALL || record.timePeriod === filters.timePeriod) &&
      (filters.networkType === ALL || record.networkType === filters.networkType) &&
      (filters.issueType === ALL || record.issueType === filters.issueType)
    );
  });
}

export function getFilterOptions(records: StandardRecord[]) {
  return {
    districts: [ALL, ...new Set(records.map((record) => record.district))],
    scenarios: [ALL, ...new Set(records.map((record) => record.scenario))],
    timePeriods: [ALL, ...new Set(records.map((record) => record.timePeriod))],
    networkTypes: [ALL, ...new Set(records.map((record) => record.networkType))],
    issueTypes: [ALL, ...new Set(records.map((record) => record.issueType))],
  };
}

export function computeAnalyticsSummary(records: StandardRecord[]): AnalyticsSummary {
  const districtScores = buildDistrictScores(records);
  const scenarioPerformance = distribution(records, (record) => record.scenario)
    .slice(0, 8)
    .map((item) => {
      const items = records.filter((record) => record.scenario === item.name);
      return {
        scenario: item.name,
        avgDownload: round(average(items.map((record) => record.downloadMbps)), 1),
        avgLatency: round(average(items.map((record) => record.latencyMs)), 1),
        complaintRate: round(rate(items, (record) => record.complaint === "是"), 1),
      };
    });

  const timeOrder = ["早高峰", "午间", "晚高峰", "非高峰", "深夜"];
  const timePerformance = timeOrder
    .filter((period) => records.some((record) => record.timePeriod === period))
    .map((period) => {
      const items = records.filter((record) => record.timePeriod === period);
      return {
        timePeriod: period,
        avgDownload: round(average(items.map((record) => record.downloadMbps)), 1),
        avgLatency: round(average(items.map((record) => record.latencyMs)), 1),
        complaintRate: round(rate(items, (record) => record.complaint === "是"), 1),
      };
    });

  return {
    sampleSize: records.length,
    dateRange: formatDateRange(records),
    avgDownload: round(average(records.map((record) => record.downloadMbps)), 2),
    avgUpload: round(average(records.map((record) => record.uploadMbps)), 2),
    avgLatency: round(average(records.map((record) => record.latencyMs)), 1),
    avgJitter: round(average(records.map((record) => record.jitterMs)), 1),
    complaintRate: round(rate(records, (record) => record.complaint === "是"), 1),
    satisfactionRate: round(
      rate(
        records,
        (record) => record.satisfaction === "满意" || record.satisfaction === "非常满意",
      ),
      1,
    ),
    slaPassRate: round(
      rate(records.filter((record) => record.slaStatus !== "不适用"), (record) => record.slaStatus === "达标"),
      1,
    ),
    repeatedRate: round(rate(records, (record) => record.repeatedFeedback === "是"), 1),
    networkTypeShare: distribution(records, (record) => record.networkType),
    issueDistribution: distribution(records, (record) => record.issueType),
    scenarioPerformance,
    timePerformance,
    districtScores,
    heatmap: buildHeatmap(records),
    insights: buildInsights(records, districtScores),
  };
}

export function getDistrictTrend(records: StandardRecord[], district: string) {
  const scoped = records.filter((record) => record.district === district);
  const scenarios = distribution(scoped, (record) => record.scenario).slice(0, 6);

  return scenarios.map((item) => {
    const items = scoped.filter((record) => record.scenario === item.name);
    return {
      scenario: item.name,
      avgDownload: round(average(items.map((record) => record.downloadMbps)), 1),
      avgLatency: round(average(items.map((record) => record.latencyMs)), 1),
      complaintRate: round(rate(items, (record) => record.complaint === "是"), 1),
    };
  });
}

export function toPercentageDistribution(items: DistributionItem[], total: number) {
  return items.map((item) => ({
    ...item,
    value: total === 0 ? 0 : round((item.value / total) * 100, 1),
  }));
}
