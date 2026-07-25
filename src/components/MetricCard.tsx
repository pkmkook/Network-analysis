type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  accent?: "cyan" | "emerald" | "amber" | "rose";
};

const accentStyles = {
  cyan: "from-cyan-400/20 to-sky-500/10 border-cyan-300/20 text-cyan-100",
  emerald: "from-emerald-400/20 to-teal-500/10 border-emerald-300/20 text-emerald-100",
  amber: "from-amber-300/20 to-orange-500/10 border-amber-200/20 text-amber-100",
  rose: "from-rose-400/20 to-pink-500/10 border-rose-300/20 text-rose-100",
};

export function MetricCard({
  label,
  value,
  hint,
  accent = "cyan",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-[24px] border bg-gradient-to-br ${accentStyles[accent]} p-5 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl`}
    >
      <div className="text-xs uppercase tracking-[0.22em] text-slate-300">{label}</div>
      <div className="mt-4 font-display text-3xl text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-300">{hint}</div>
    </div>
  );
}
