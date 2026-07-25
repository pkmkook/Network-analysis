import { Fragment } from "react";
import type { HeatmapCell } from "@/types/network";

type ScenarioHeatmapProps = {
  items: HeatmapCell[];
};

function cellOpacity(value: number, maxValue: number) {
  if (maxValue === 0) {
    return 0.12;
  }
  return 0.12 + (value / maxValue) * 0.88;
}

export function ScenarioHeatmap({ items }: ScenarioHeatmapProps) {
  const rows = [...new Set(items.map((item) => item.row))];
  const columns = [...new Set(items.map((item) => item.column))];
  const maxValue = Math.max(...items.map((item) => item.value), 0);

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">问题热度</div>
      <h2 className="mt-2 font-display text-xl text-white">区域与问题类型交叉热图</h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        颜色越亮表示该行政区在对应问题上的反馈数量越多，用于识别聚集性故障。
      </p>

      <div className="mt-5 overflow-auto">
        <div
          className="grid min-w-[780px] gap-2"
          style={{ gridTemplateColumns: `160px repeat(${columns.length}, minmax(96px, 1fr))` }}
        >
          <div />
          {columns.map((column) => (
            <div
              key={column}
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-xs tracking-[0.18em] text-slate-300"
            >
              {column}
            </div>
          ))}

          {rows.map((row) => (
            <Fragment key={row}>
              <div
                className="flex items-center rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white"
              >
                {row}
              </div>
              {columns.map((column) => {
                const match = items.find(
                  (item) => item.row === row && item.column === column,
                ) ?? { value: 0 };
                return (
                  <div
                    key={`${row}-${column}`}
                    className="rounded-2xl border border-cyan-300/10 px-2 py-3 text-center text-sm text-white"
                    style={{
                      background: `rgba(34, 211, 238, ${cellOpacity(match.value, maxValue)})`,
                    }}
                  >
                    {match.value}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
