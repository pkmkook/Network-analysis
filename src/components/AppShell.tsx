import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { DatabaseZap, Gauge, MapPinned, RotateCcw, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DatasetMeta } from "@/types/network";

type AppShellProps = {
  datasetMeta: DatasetMeta;
  onResetDemo: () => void;
  children: ReactNode;
};

const links = [
  { to: "/", label: "总览", icon: Gauge },
  { to: "/districts", label: "区域分析", icon: MapPinned },
  { to: "/workspace", label: "数据工作台", icon: UploadCloud },
];

export function AppShell({ datasetMeta, onResetDemo, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_26%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,1))]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
                <DatabaseZap className="h-4 w-4" />
                Hong Kong Network Quality Intelligence
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-3xl tracking-[0.06em] text-white sm:text-5xl">
                  香港十八区网络质量分析中心
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  一次接入数据，自动完成字段识别、清洗、区域评分、问题分布和场景洞察，适合日常分析和汇报展示。
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/60 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">当前数据集</div>
                <div className="mt-2 text-sm font-medium text-white">{datasetMeta.datasetName}</div>
                <div className="mt-2 text-xs text-slate-400">
                  来源：{datasetMeta.source === "demo" ? "内置模拟数据" : "用户上传"}
                </div>
              </div>
              <button
                type="button"
                onClick={onResetDemo}
                className="flex items-center justify-center gap-2 rounded-3xl border border-amber-300/20 bg-amber-300/10 px-4 py-4 text-sm font-medium text-amber-100 transition hover:border-amber-200/40 hover:bg-amber-300/15"
              >
                <RotateCcw className="h-4 w-4" />
                恢复默认样本
              </button>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-3">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
