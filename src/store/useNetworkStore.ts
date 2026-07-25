import { create } from "zustand";
import type {
  DataQualityReport,
  DatasetMeta,
  FieldMapping,
  Filters,
  ParsedDataset,
  RawRow,
  StandardField,
  StandardRecord,
} from "@/types/network";
import {
  autoDetectMapping,
  buildDataQualityReport,
  createDefaultMapping,
  standardizeRows,
} from "@/utils/fileParsers";
import { generateDemoDataset } from "@/utils/networkDataset";
import { createDefaultFilters } from "@/utils/networkAnalytics";

type PersistedState = {
  headers: string[];
  rawRows: RawRow[];
  mapping: FieldMapping;
  records: StandardRecord[];
  datasetMeta: DatasetMeta;
};

type NetworkState = {
  datasetMeta: DatasetMeta;
  headers: string[];
  rawRows: RawRow[];
  mapping: FieldMapping;
  qualityReport: DataQualityReport | null;
  records: StandardRecord[];
  filters: Filters;
  selectedDistrict: string;
  loadParsedDataset: (dataset: ParsedDataset) => void;
  updateMapping: (field: StandardField, header: string | null) => void;
  applyCurrentMapping: () => void;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
  setSelectedDistrict: (district: string) => void;
  resetToDemo: () => void;
};

const STORAGE_KEY = "hk-network-quality-dashboard";

function persistUploadedState(state: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearPersistedState() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

function createDemoState() {
  return {
    datasetMeta: {
      datasetName: "内置模拟数据集（2000 条）",
      source: "demo" as const,
      uploadedAt: new Date().toISOString(),
    },
    headers: [],
    rawRows: [],
    mapping: createDefaultMapping(),
    qualityReport: null,
    records: generateDemoDataset(),
    filters: createDefaultFilters(),
    selectedDistrict: "中西区",
  };
}

function buildUploadState(
  datasetMeta: DatasetMeta,
  headers: string[],
  rawRows: RawRow[],
  mapping: FieldMapping,
) {
  const records = standardizeRows(rawRows, mapping);
  const qualityReport = buildDataQualityReport(rawRows, headers, mapping, records);

  return {
    datasetMeta,
    headers,
    rawRows,
    mapping,
    records,
    qualityReport,
  };
}

function loadPersistedState() {
  if (typeof window === "undefined") {
    return createDemoState();
  }

  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    return createDemoState();
  }

  try {
    const persisted = JSON.parse(cached) as PersistedState;
    return {
      ...createDemoState(),
      ...buildUploadState(
        persisted.datasetMeta,
        persisted.headers,
        persisted.rawRows,
        persisted.mapping,
      ),
      selectedDistrict: persisted.records[0]?.district ?? "中西区",
    };
  } catch {
    return createDemoState();
  }
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  ...loadPersistedState(),
  loadParsedDataset: (dataset) => {
    const mapping = autoDetectMapping(dataset.headers);
    const datasetMeta: DatasetMeta = {
      datasetName: dataset.fileName,
      source: "upload",
      uploadedAt: new Date().toISOString(),
    };
    const uploadState = buildUploadState(datasetMeta, dataset.headers, dataset.rows, mapping);

    set({
      ...uploadState,
      filters: createDefaultFilters(),
      selectedDistrict: uploadState.records[0]?.district ?? "中西区",
    });

    persistUploadedState({
      headers: dataset.headers,
      rawRows: dataset.rows,
      mapping,
      records: uploadState.records,
      datasetMeta,
    });
  },
  updateMapping: (field, header) => {
    set((state) => ({
      mapping: {
        ...state.mapping,
        [field]: header,
      },
    }));
  },
  applyCurrentMapping: () => {
    const { headers, rawRows, mapping, datasetMeta } = get();
    const uploadState = buildUploadState(datasetMeta, headers, rawRows, mapping);

    set({
      ...uploadState,
      filters: createDefaultFilters(),
      selectedDistrict: uploadState.records[0]?.district ?? "中西区",
    });

    if (datasetMeta.source === "upload") {
      persistUploadedState({
        headers,
        rawRows,
        mapping,
        records: uploadState.records,
        datasetMeta,
      });
    }
  },
  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },
  resetFilters: () => {
    set({
      filters: createDefaultFilters(),
    });
  },
  setSelectedDistrict: (district) => {
    set({
      selectedDistrict: district,
    });
  },
  resetToDemo: () => {
    clearPersistedState();
    set(createDemoState());
  },
}));
