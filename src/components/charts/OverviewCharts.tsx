import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsSummary } from "@/types/network";
import { toPercentageDistribution } from "@/utils/networkAnalytics";
import { ChartCard } from "./ChartCard";

type OverviewChartsProps = {
  summary: AnalyticsSummary;
};

const colors = ["#22d3ee", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#818cf8"];

export function OverviewCharts({ summary }: OverviewChartsProps) {
  const networkShare = toPercentageDistribution(
    summary.networkTypeShare,
    summary.sampleSize,
  );
  const issueDistribution = summary.issueDistribution.slice(0, 6);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <ChartCard
        eyebrow="问题分布"
        title="主要网络问题集中在什么地方"
        description="结合样本量查看高频故障类型，帮助快速定位用户抱怨最明显的体验短板。"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={issueDistribution}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(15,23,42,0.35)" }}
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 16,
                color: "#fff",
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {issueDistribution.map((item, index) => (
                <Cell key={item.name} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        eyebrow="制式结构"
        title="5G / 4G 使用占比"
        description="展示当前样本中的网络制式结构，判断是否存在切网场景过多或 4G 承压情况。"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={networkShare}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {networkShare.map((item, index) => (
                <Cell key={item.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "占比"]}
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 16,
                color: "#fff",
              }}
            />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
