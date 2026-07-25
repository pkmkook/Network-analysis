import type { Filters } from "@/types/network";

type FilterOptions = {
  districts: string[];
  scenarios: string[];
  timePeriods: string[];
  networkTypes: string[];
  issueTypes: string[];
};

type FilterBarProps = {
  filters: Filters;
  options: FilterOptions;
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
};

const fieldConfig: Array<{
  key: keyof Filters;
  label: string;
  optionsKey: keyof FilterOptions;
}> = [
  { key: "district", label: "行政区", optionsKey: "districts" },
  { key: "scenario", label: "场景", optionsKey: "scenarios" },
  { key: "timePeriod", label: "时段", optionsKey: "timePeriods" },
  { key: "networkType", label: "网络制式", optionsKey: "networkTypes" },
  { key: "issueType", label: "问题类型", optionsKey: "issueTypes" },
];

export function FilterBar({ filters, options, onChange, onReset }: FilterBarProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">动态筛选</div>
          <h2 className="mt-2 font-display text-xl text-white">按区域、场景、时段与问题交叉分析</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
        >
          清空筛选
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {fieldConfig.map(({ key, label, optionsKey }) => (
          <label key={key} className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
            <select
              value={filters[key]}
              onChange={(event) => onChange(key, event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
            >
              {options[optionsKey].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}
