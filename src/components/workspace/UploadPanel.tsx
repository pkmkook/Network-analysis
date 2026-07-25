import { FileSpreadsheet, RefreshCcw, UploadCloud } from "lucide-react";

type UploadPanelProps = {
  fileName: string;
  onFileChange: (file: File) => void;
  onResetDemo: () => void;
};

export function UploadPanel({
  fileName,
  onFileChange,
  onResetDemo,
}: UploadPanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">数据上传</div>
      <h2 className="mt-2 font-display text-xl text-white">替换新数据后自动重跑分析</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
        支持上传 `CSV` 或 `XLSX` 文件。系统会自动识别常见字段名；如果列名不一致，可在下方字段映射区手动绑定。
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-cyan-300/30 bg-slate-950/50 px-6 py-12 text-center transition hover:border-cyan-200/50 hover:bg-slate-900/80">
          <UploadCloud className="h-9 w-9 text-cyan-200 transition group-hover:-translate-y-1" />
          <div className="mt-4 text-base font-semibold text-white">点击选择文件或拖拽到此处</div>
          <div className="mt-2 text-sm text-slate-400">
            建议保留包含区域、速率、时延、问题类型、满意度等字段
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-100">
            <FileSpreadsheet className="h-4 w-4" />
            {fileName}
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onFileChange(file);
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        <button
          type="button"
          onClick={onResetDemo}
          className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm font-medium text-amber-100 transition hover:border-amber-200/40 hover:bg-amber-300/15"
        >
          <RefreshCcw className="h-4 w-4" />
          恢复内置样本
        </button>
      </div>
    </section>
  );
}
