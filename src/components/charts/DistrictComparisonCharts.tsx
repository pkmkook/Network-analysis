import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DistrictScore } from "@/types/network";
import { ChartCard } from "./ChartCard";

type TrendItem = {
  scenario: string;
  avgDownload: number;
  avgLatency: number;
  complaintRate: number;
};

type DistrictComparisonChartsProps = {
  scores: DistrictScore[];
  selectedDistrict: DistrictScore | undefined;
  trend: TrendItem[];
};

export function DistrictComparisonCharts({
  scores,
  selectedDistrict,
  trend,
}: DistrictComparisonChartsProps) {
  const topScores = scores.slice(0, 10);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <ChartCard
        eyebrow="区域排行"
        title="综合得分 Top 10"
        description="综合下载速率、时延、投诉率和满意度形成统一评分，便于横向比较。"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topScores} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="district"
              tick={{ fill: "#e2e8f0", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={76}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 16,
                color: "#fff",
              }}
            />
            <Bar dataKey="score" fill="#22d3ee" radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        eyebrow="场景剖面"
        title={selectedDistrict ? `${selectedDistrict.district} 场景表现` : "区域场景表现"}
        description="查看选中行政区在不同场景下的下载速率、时延和投诉率差异。"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis
              dataKey="scenario"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis yAxisId="left" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 16,
                color: "#fff",
              }}
            />
            <Bar yAxisId="left" dataKey="avgDownload" fill="#34d399" radius={[10, 10, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgLatency"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fbbf24" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="complaintRate"
              stroke="#fb7185"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#fb7185" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
