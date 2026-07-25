import { AlertTriangle, CircleGauge, Sparkles } from "lucide-react";
import type { InsightItem } from "@/types/network";

type InsightListProps = {
  items: InsightItem[];
};

const toneMap = {
  good: {
    icon: CircleGauge,
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  },
  neutral: {
    icon: Sparkles,
    className: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  },
};

export function InsightList({ items }: InsightListProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">自动洞察</div>
      <h2 className="mt-2 font-display text-xl text-white">系统总结的关键结论</h2>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {items.map((item) => {
          const config = toneMap[item.tone];
          const Icon = config.icon;

          return (
            <article
              key={item.title}
              className={`rounded-[24px] border p-4 ${config.className}`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-950/30 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-100/85">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
