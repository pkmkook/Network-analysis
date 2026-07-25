import type { FieldMapping, StandardField } from "@/types/network";
import {
  REQUIRED_FIELDS,
  STANDARD_FIELD_LABELS,
} from "@/utils/fileParsers";

type FieldMappingEditorProps = {
  headers: string[];
  mapping: FieldMapping;
  onChange: (field: StandardField, header: string | null) => void;
  onApply: () => void;
};

export function FieldMappingEditor({
  headers,
  mapping,
  onChange,
  onApply,
}: FieldMappingEditorProps) {
  const standardFields = Object.keys(STANDARD_FIELD_LABELS) as StandardField[];

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">字段映射</div>
          <h2 className="mt-2 font-display text-xl text-white">将新文件字段映射到标准分析字段</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            标记为“必需”的字段未映射时，图表仍可显示，但分析结果会明显受限。
          </p>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
        >
          应用映射并重算
        </button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {standardFields.map((field) => {
          const isRequired = REQUIRED_FIELDS.includes(field);
          return (
            <div
              key={field}
              className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-white">
                  {STANDARD_FIELD_LABELS[field]}
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${
                    isRequired
                      ? "bg-amber-300/10 text-amber-100"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isRequired ? "必需" : "可选"}
                </div>
              </div>
              <select
                value={mapping[field] ?? ""}
                onChange={(event) => onChange(field, event.target.value || null)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
              >
                <option value="">未映射</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </section>
  );
}
