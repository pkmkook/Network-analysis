export type RawValue = string | number | boolean | null | undefined;
export type RawRow = Record<string, RawValue>;

export type StandardField =
  | "recordId"
  | "feedbackDate"
  | "district"
  | "area"
  | "scenario"
  | "networkType"
  | "timePeriod"
  | "app"
  | "deviceSystem"
  | "downloadMbps"
  | "uploadMbps"
  | "latencyMs"
  | "jitterMs"
  | "packetLossPct"
  | "rsrpDbm"
  | "sinrDb"
  | "issueType"
  | "satisfaction"
  | "complaint"
  | "dissatisfactionReason"
  | "userSuggestion"
  | "resolutionHours"
  | "slaStatus"
  | "repeatedFeedback";

export type StandardRecord = {
  sourceRow: number;
  recordId: string;
  feedbackDate: string;
  district: string;
  area: string;
  scenario: string;
  networkType: string;
  timePeriod: string;
  app: string;
  deviceSystem: string;
  downloadMbps: number;
  uploadMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPct: number;
  rsrpDbm: number;
  sinrDb: number;
  issueType: string;
  satisfaction: string;
  complaint: string;
  dissatisfactionReason: string;
  userSuggestion: string;
  resolutionHours: number;
  slaStatus: string;
  repeatedFeedback: string;
};

export type FieldMapping = Record<StandardField, string | null>;

export type DatasetMeta = {
  datasetName: string;
  source: "demo" | "upload";
  uploadedAt: string;
};

export type Filters = {
  district: string;
  scenario: string;
  timePeriod: string;
  networkType: string;
  issueType: string;
};

export type DistributionItem = {
  name: string;
  value: number;
};

export type DistrictScore = {
  district: string;
  score: number;
  avgDownload: number;
  avgUpload: number;
  avgLatency: number;
  complaintRate: number;
  satisfactionRate: number;
  sampleSize: number;
  topIssue: string;
  repeatedRate: number;
};

export type HeatmapCell = {
  row: string;
  column: string;
  value: number;
};

export type InsightItem = {
  title: string;
  description: string;
  tone: "good" | "warning" | "neutral";
};

export type AnalyticsSummary = {
  sampleSize: number;
  dateRange: string;
  avgDownload: number;
  avgUpload: number;
  avgLatency: number;
  avgJitter: number;
  complaintRate: number;
  satisfactionRate: number;
  slaPassRate: number;
  repeatedRate: number;
  networkTypeShare: DistributionItem[];
  issueDistribution: DistributionItem[];
  scenarioPerformance: Array<{
    scenario: string;
    avgDownload: number;
    avgLatency: number;
    complaintRate: number;
  }>;
  timePerformance: Array<{
    timePeriod: string;
    avgDownload: number;
    avgLatency: number;
    complaintRate: number;
  }>;
  districtScores: DistrictScore[];
  heatmap: HeatmapCell[];
  insights: InsightItem[];
};

export type DataQualityReport = {
  rowCount: number;
  headerCount: number;
  missingCriticalFields: string[];
  emptyDistrictCount: number;
  emptyDownloadCount: number;
  emptyLatencyCount: number;
  invalidDateCount: number;
};

export type ParsedDataset = {
  headers: string[];
  rows: RawRow[];
  fileName: string;
};
