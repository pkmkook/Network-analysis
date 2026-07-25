import { useMemo, useState } from "react";
import { Download, FileJson } from "lucide-react";
import { DataPreviewTable } from "@/components/workspace/DataPreviewTable";
import { FieldMappingEditor } from "@/components/workspace/FieldMappingEditor";
import { UploadPanel } from "@/components/workspace/UploadPanel";
import { useNetworkStore } from "@/store/useNetworkStore";
import { parseDataFile, serializeStandardRecordsToCsv } from "@/utils/fileParsers";
import { computeAnalyticsSummary } from "@/utils/networkAnalytics";
import { downloadTextFile } from "@/utils/format";

export default function WorkspacePage() {
  const datasetMeta = useNetworkStore((state) => state.datasetMeta);
  const headers = useNetworkStore((state) => state.headers);
  const rawRows = useNetworkStore((state) => state.rawRows);
  const mapping = useNetworkStore((state) => state.mapping);
  const records = useNetworkStore((state) => state.records);
  const qualityReport = useNetworkStore((state) => state.qualityReport);
  const loadParsedDataset = useNetworkStore((state) => state.loadParsedDataset);
  const updateMapping = useNetworkStore((state) => state.updateMapping);
  const applyCurrentMapping = useNetworkStore((state) => state.applyCurrentMapping);
  const resetToDemo = useNetworkStore((state) => state.resetToDemo);
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => computeAnalyticsSummary(records), [records]);

  async function handleFileChange(file: File) {
    setLoading(true);
    try {
      const parsed = await parseDataFile(file);
      loadParsedDataset(parsed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">数据工作台</div>
        <h2 className="mt-3 font-display text-2xl text-white sm:text-4xl">
          管理上传文件、字段映射与导出结果
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          当前数据集为 {datasetMeta.datasetName}。上传新文件后，系统会重新标准化并刷新全部页面图表。
        </p>
      </section>

      <UploadPanel
        fileName={loading ? "正在解析文件..." : datasetMeta.datasetName}
        onFileChange={handleFileChange}
        onResetDemo={resetToDemo}
      />

      {headers.length > 0 ? (
        <FieldMappingEditor
          headers={headers}
          mapping={mapping}
          onChange={updateMapping}
          onApply={applyCurrentMapping}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <DataPreviewTable rows={rawRows} report={qualityReport} />

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">导出结果</div>
          <h2 className="mt-2 font-display text-xl text-white">分析摘要与标准化数据</h2>

          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>样本量：{summary.sampleSize}</p>
            <p>平均下载：{summary.avgDownload} Mbps</p>
            <p>平均时延：{summary.avgLatency} ms</p>
            <p>投诉率：{summary.complaintRate}%</p>
            <p>满意度：{summary.satisfactionRate}%</p>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() =>
                downloadTextFile(
                  JSON.stringify(
                    {
                      datasetMeta,
                      summary,
                    },
                    null,
                    2,
                  ),
                  "hk-network-summary.json",
                  "application/json;charset=utf-8",
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
            >
              <FileJson className="h-4 w-4" />
              导出摘要 JSON
            </button>
            <button
              type="button"
              onClick={() =>
                downloadTextFile(
                  `\ufeff${serializeStandardRecordsToCsv(records)}`,
                  "hk-network-standardized.csv",
                  "text/csv;charset=utf-8",
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              导出标准化 CSV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
