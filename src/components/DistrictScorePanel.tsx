import { Activity, ArrowRight, Signal, TimerReset } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DistrictScore } from "@/types/network";
import { formatPercent } from "@/utils/format";

type DistrictScorePanelProps = {
  items: DistrictScore[];
  selectedDistrict?: string;
  onSelect?: (district: string) => void;
};

export function DistrictScorePanel({
  items,
  selectedDistrict,
  onSelect,
}: DistrictScorePanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">区域评分</div>
          <h2 className="mt-2 font-display text-xl text-white">十八区网络表现矩阵</h2>
        </div>
        <div className="text-sm text-slate-400">点击卡片可查看或联动区域详情</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.district}
            type="button"
            onClick={() => onSelect?.(item.district)}
            className={cn(
              "rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10",
              selectedDistrict === item.district
                ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
                : "border-white/10 bg-slate-950/55",
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Rank {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{item.district}</div>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 font-display text-xl text-cyan-100">
                {item.score}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <Signal className="h-3.5 w-3.5" />
                  下载速率
                </div>
                <div className="mt-2 text-base text-white">{item.avgDownload} Mbps</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <TimerReset className="h-3.5 w-3.5" />
                  时延
                </div>
                <div className="mt-2 text-base text-white">{item.avgLatency} ms</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <Activity className="h-3.5 w-3.5" />
                  投诉率
                </div>
                <div className="mt-2 text-base text-white">{formatPercent(item.complaintRate)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">主要问题</div>
                <div className="mt-2 text-base text-white">{item.topIssue}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>满意度 {formatPercent(item.satisfactionRate)}</span>
              <span className="inline-flex items-center gap-1 text-cyan-100">
                查看详情
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
