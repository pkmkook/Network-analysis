import type { ReactNode } from "react";

type ChartCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function ChartCard({
  eyebrow,
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">{eyebrow}</div>
      <h2 className="mt-2 font-display text-xl text-white">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-5 h-[320px]">{children}</div>
    </section>
  );
}
