import Papa from "papaparse";
import * as XLSX from "xlsx";
import type {
  DataQualityReport,
  FieldMapping,
  ParsedDataset,
  RawRow,
  StandardField,
  StandardRecord,
} from "@/types/network";

export const STANDARD_FIELD_LABELS: Record<StandardField, string> = {
  recordId: "记录编号",
  feedbackDate: "反馈日期",
  district: "香港行政区",
  area: "地点",
  scenario: "场景类型",
  networkType: "网络制式",
  timePeriod: "使用时段",
  app: "主要使用App",
  deviceSystem: "设备系统",
  downloadMbps: "下载速度_Mbps",
  uploadMbps: "上传速度_Mbps",
  latencyMs: "网络时延_ms",
  jitterMs: "抖动_ms",
  packetLossPct: "丢包率_pct",
  rsrpDbm: "RSRP_dBm",
  sinrDb: "SINR_dB",
  issueType: "主要网络质量问题",
  satisfaction: "用户满意度",
  complaint: "是否提交投诉",
  dissatisfactionReason: "不满意原因",
  userSuggestion: "用户建议和意见",
  resolutionHours: "处理时长_小时",
  slaStatus: "SLA状态",
  repeatedFeedback: "是否重复反馈",
};

export const REQUIRED_FIELDS: StandardField[] = [
  "district",
  "downloadMbps",
  "latencyMs",
  "issueType",
  "networkType",
  "scenario",
  "timePeriod",
  "satisfaction",
  "complaint",
];

const fieldAliases: Record<StandardField, string[]> = {
  recordId: ["记录编号", "编号", "id", "record_id"],
  feedbackDate: ["反馈日期", "日期", "date", "feedback_date"],
  district: ["香港行政区", "行政区", "区域", "地区", "district", "region"],
  area: ["地点", "位置", "area", "location", "区域地点"],
  scenario: ["场景类型", "场景", "scenario"],
  networkType: ["网络制式", "网络类型", "制式", "network_type"],
  timePeriod: ["使用时段", "时段", "time_period"],
  app: ["主要使用App", "app", "使用应用", "应用"],
  deviceSystem: ["设备系统", "系统", "os", "device_system"],
  downloadMbps: ["下载速度_Mbps", "下载速度", "download_mbps", "download"],
  uploadMbps: ["上传速度_Mbps", "上传速度", "upload_mbps", "upload"],
  latencyMs: ["网络时延_ms", "时延", "latency_ms", "latency", "ping"],
  jitterMs: ["抖动_ms", "抖动", "jitter_ms", "jitter"],
  packetLossPct: ["丢包率_pct", "丢包率", "packet_loss_pct", "packet_loss"],
  rsrpDbm: ["RSRP_dBm", "rsrp", "信号强度"],
  sinrDb: ["SINR_dB", "sinr", "信噪比"],
  issueType: ["主要网络质量问题", "问题类型", "问题", "issue_type"],
  satisfaction: ["用户满意度", "满意度", "satisfaction"],
  complaint: ["是否提交投诉", "投诉", "是否投诉", "complaint"],
  dissatisfactionReason: ["不满意原因", "原因", "reason"],
  userSuggestion: ["用户建议和意见", "建议", "意见", "suggestion"],
  resolutionHours: ["处理时长_小时", "处理时长", "resolution_hours"],
  slaStatus: ["SLA状态", "sla", "sla_status"],
  repeatedFeedback: ["是否重复反馈", "重复反馈", "repeat_feedback"],
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_\-/()（）]+/g, "");
}

function normalizeValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function toNumber(value: unknown) {
  const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateString(value: unknown) {
  const text = normalizeValue(value);
  if (!text) {
    return "";
  }
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}

function toBinaryYesNo(value: unknown) {
  const text = normalizeValue(value);
  if (!text) {
    return "否";
  }
  return ["是", "yes", "true", "1", "y"].includes(text.toLowerCase()) ? "是" : "否";
}

function getValue(row: RawRow, fieldName: string | null) {
  if (!fieldName) {
    return "";
  }
  return row[fieldName];
}

export function createDefaultMapping(): FieldMapping {
  return Object.keys(STANDARD_FIELD_LABELS).reduce((mapping, field) => {
    mapping[field as StandardField] = null;
    return mapping;
  }, {} as FieldMapping);
}

export function autoDetectMapping(headers: string[]): FieldMapping {
  const mapping = createDefaultMapping();
  const normalizedHeaders = new Map(
    headers.map((header) => [normalizeHeader(header), header]),
  );

  for (const field of Object.keys(fieldAliases) as StandardField[]) {
    const aliases = [STANDARD_FIELD_LABELS[field], ...fieldAliases[field]];
    const match = aliases
      .map((alias) => normalizedHeaders.get(normalizeHeader(alias)))
      .find(Boolean);
    mapping[field] = match ?? null;
  }

  return mapping;
}

export async function parseDataFile(file: File): Promise<ParsedDataset> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    const text = await file.text();
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    }) as Papa.ParseResult<RawRow>;

    return {
      headers: parsed.meta.fields ?? [],
      rows: parsed.data,
      fileName: file.name,
    };
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<RawRow>(worksheet, { defval: "" });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return {
    headers,
    rows,
    fileName: file.name,
  };
}

export function standardizeRows(rows: RawRow[], mapping: FieldMapping): StandardRecord[] {
  return rows.map((row, index) => {
    const complaintValue = getValue(row, mapping.complaint);
    const satisfactionValue = normalizeValue(getValue(row, mapping.satisfaction)) || "一般";
    const issueType = normalizeValue(getValue(row, mapping.issueType)) || "无明显问题";

    return {
      sourceRow: index + 1,
      recordId:
        normalizeValue(getValue(row, mapping.recordId)) ||
        `UPLOAD-${String(index + 1).padStart(5, "0")}`,
      feedbackDate: toDateString(getValue(row, mapping.feedbackDate)),
      district: normalizeValue(getValue(row, mapping.district)) || "未识别区域",
      area: normalizeValue(getValue(row, mapping.area)) || "未提供地点",
      scenario: normalizeValue(getValue(row, mapping.scenario)) || "未知场景",
      networkType: normalizeValue(getValue(row, mapping.networkType)) || "未知制式",
      timePeriod: normalizeValue(getValue(row, mapping.timePeriod)) || "未知时段",
      app: normalizeValue(getValue(row, mapping.app)) || "未提供应用",
      deviceSystem: normalizeValue(getValue(row, mapping.deviceSystem)) || "未知系统",
      downloadMbps: toNumber(getValue(row, mapping.downloadMbps)),
      uploadMbps: toNumber(getValue(row, mapping.uploadMbps)),
      latencyMs: toNumber(getValue(row, mapping.latencyMs)),
      jitterMs: toNumber(getValue(row, mapping.jitterMs)),
      packetLossPct: toNumber(getValue(row, mapping.packetLossPct)),
      rsrpDbm: toNumber(getValue(row, mapping.rsrpDbm)),
      sinrDb: toNumber(getValue(row, mapping.sinrDb)),
      issueType,
      satisfaction: satisfactionValue,
      complaint:
        normalizeValue(complaintValue) === ""
          ? satisfactionValue.includes("不满意")
            ? "是"
            : "否"
          : toBinaryYesNo(complaintValue),
      dissatisfactionReason:
        normalizeValue(getValue(row, mapping.dissatisfactionReason)) || "无",
      userSuggestion: normalizeValue(getValue(row, mapping.userSuggestion)) || "无",
      resolutionHours: toNumber(getValue(row, mapping.resolutionHours)),
      slaStatus: normalizeValue(getValue(row, mapping.slaStatus)) || "不适用",
      repeatedFeedback: toBinaryYesNo(getValue(row, mapping.repeatedFeedback)),
    };
  });
}

export function buildDataQualityReport(
  rows: RawRow[],
  headers: string[],
  mapping: FieldMapping,
  standardizedRows: StandardRecord[],
): DataQualityReport {
  return {
    rowCount: rows.length,
    headerCount: headers.length,
    missingCriticalFields: REQUIRED_FIELDS.filter((field) => !mapping[field]).map(
      (field) => STANDARD_FIELD_LABELS[field],
    ),
    emptyDistrictCount: standardizedRows.filter((row) => row.district === "未识别区域").length,
    emptyDownloadCount: standardizedRows.filter((row) => row.downloadMbps <= 0).length,
    emptyLatencyCount: standardizedRows.filter((row) => row.latencyMs <= 0).length,
    invalidDateCount: standardizedRows.filter((row) => !row.feedbackDate).length,
  };
}

export function serializeStandardRecordsToCsv(records: StandardRecord[]) {
  return Papa.unparse(
    records.map((record) => ({
      记录编号: record.recordId,
      反馈日期: record.feedbackDate,
      香港行政区: record.district,
      地点: record.area,
      场景类型: record.scenario,
      网络制式: record.networkType,
      使用时段: record.timePeriod,
      主要使用App: record.app,
      设备系统: record.deviceSystem,
      下载速度_Mbps: record.downloadMbps,
      上传速度_Mbps: record.uploadMbps,
      网络时延_ms: record.latencyMs,
      抖动_ms: record.jitterMs,
      丢包率_pct: record.packetLossPct,
      RSRP_dBm: record.rsrpDbm,
      SINR_dB: record.sinrDb,
      主要网络质量问题: record.issueType,
      用户满意度: record.satisfaction,
      是否提交投诉: record.complaint,
      不满意原因: record.dissatisfactionReason,
      用户建议和意见: record.userSuggestion,
      处理时长_小时: record.resolutionHours,
      SLA状态: record.slaStatus,
      是否重复反馈: record.repeatedFeedback,
    })),
  );
}
