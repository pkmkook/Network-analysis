import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { InsightList } from "@/components/InsightList";
import { DistrictScorePanel } from "@/components/DistrictScorePanel";
import { MetricCard } from "@/components/MetricCard";
import { OverviewCharts } from "@/components/charts/OverviewCharts";
import { ScenarioHeatmap } from "@/components/charts/ScenarioHeatmap";
import { useNetworkStore } from "@/store/useNetworkStore";
import {
  computeAnalyticsSummary,
  filterRecords,
  getFilterOptions,
} from "@/utils/networkAnalytics";
import { formatNumber, formatPercent } from "@/utils/format";

export default function OverviewPage() {
  const navigate = useNavigate();
  const records = useNetworkStore((state) => state.records);
  const filters = useNetworkStore((state) => state.filters);
  const setFilter = useNetworkStore((state) => state.setFilter);
  const resetFilters = useNetworkStore((state) => state.resetFilters);
  const setSelectedDistrict = useNetworkStore((state) => state.setSelectedDistrict);

  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters]);
  const summary = useMemo(
    () => computeAnalyticsSummary(filteredRecords),
    [filteredRecords],
  );
  const options = useMemo(() => getFilterOptions(records), [records]);

  function handleDistrictSelect(district: string) {
    setSelectedDistrict(district);
    navigate("/districts");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">全港总览</div>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-4xl">
            从区域、场景、时段与用户体验多维观察香港网络质量
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            当前筛选范围包含 {summary.sampleSize} 条记录，统计区间为 {summary.dateRange}。
            你可以在下方切换行政区、网络制式或问题类型，系统会同步重算指标与图表。
          </p>
        </div>

        <div className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-6 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">即时摘要</div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-100">
            <p>平均下载速率 {formatNumber(summary.avgDownload, 2)} Mbps，平均时延 {formatNumber(summary.avgLatency)} ms。</p>
            <p>投诉率 {formatPercent(summary.complaintRate)}，满意度 {formatPercent(summary.satisfactionRate)}，重复反馈率 {formatPercent(summary.repeatedRate)}。</p>
            <p>若用于汇报，可优先查看下方“区域评分”和“自动洞察”两块内容。</p>
          </div>
        </div>
      </section>

      <FilterBar
        filters={filters}
        options={options}
        onChange={setFilter}
        onReset={resetFilters}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="平均下载速率"
          value={`${formatNumber(summary.avgDownload, 2)} Mbps`}
          hint={`平均上传 ${formatNumber(summary.avgUpload, 2)} Mbps`}
          accent="cyan"
        />
        <MetricCard
          label="平均网络时延"
          value={`${formatNumber(summary.avgLatency)} ms`}
          hint={`平均抖动 ${formatNumber(summary.avgJitter)} ms`}
          accent="amber"
        />
        <MetricCard
          label="用户投诉率"
          value={formatPercent(summary.complaintRate)}
          hint={`重复反馈率 ${formatPercent(summary.repeatedRate)}`}
          accent="rose"
        />
        <MetricCard
          label="用户满意度"
          value={formatPercent(summary.satisfactionRate)}
          hint={`SLA 达标率 ${formatPercent(summary.slaPassRate)}`}
          accent="emerald"
        />
      </section>

      <OverviewCharts summary={summary} />

      <DistrictScorePanel
        items={summary.districtScores}
        onSelect={handleDistrictSelect}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ScenarioHeatmap items={summary.heatmap} />
        <InsightList items={summary.insights} />
      </div>
    </div>
  );
}
