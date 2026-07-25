import type { DataQualityReport, RawRow } from "@/types/network";

type DataPreviewTableProps = {
  rows: RawRow[];
  report: DataQualityReport | null;
};

export function DataPreviewTable({ rows, report }: DataPreviewTableProps) {
  const previewRows = rows.slice(0, 6);
  const headers = previewRows.length > 0 ? Object.keys(previewRows[0]) : [];

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">数据质量</div>
      <h2 className="mt-2 font-display text-xl text-white">预览与校验</h2>

      {report ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">行数 / 列数</div>
            <div className="mt-2 text-lg text-white">
              {report.rowCount} / {report.headerCount}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">缺失关键字段</div>
            <div className="mt-2 text-lg text-white">
              {report.missingCriticalFields.length}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">下载速率空值</div>
            <div className="mt-2 text-lg text-white">{report.emptyDownloadCount}</div>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">日期异常</div>
            <div className="mt-2 text-lg text-white">{report.invalidDateCount}</div>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-400">当前为默认样本数据，无需额外校验。</p>
      )}

      {report && report.missingCriticalFields.length > 0 ? (
        <div className="mt-4 rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
          缺失关键字段：{report.missingCriticalFields.join("、")}
        </div>
      ) : null}

      {previewRows.length > 0 ? (
        <div className="mt-5 overflow-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="rounded-2xl bg-slate-950/70 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td
                      key={`${index}-${header}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200"
                    >
                      {String(row[header] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
