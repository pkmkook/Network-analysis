import { useEffect, useMemo } from "react";
import { DistrictScorePanel } from "@/components/DistrictScorePanel";
import { FilterBar } from "@/components/FilterBar";
import { DistrictComparisonCharts } from "@/components/charts/DistrictComparisonCharts";
import { useNetworkStore } from "@/store/useNetworkStore";
import {
  computeAnalyticsSummary,
  filterRecords,
  getDistrictTrend,
  getFilterOptions,
} from "@/utils/networkAnalytics";
import { formatPercent } from "@/utils/format";

export default function DistrictsPage() {
  const records = useNetworkStore((state) => state.records);
  const filters = useNetworkStore((state) => state.filters);
  const selectedDistrict = useNetworkStore((state) => state.selectedDistrict);
  const setSelectedDistrict = useNetworkStore((state) => state.setSelectedDistrict);
  const setFilter = useNetworkStore((state) => state.setFilter);
  const resetFilters = useNetworkStore((state) => state.resetFilters);

  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters]);
  const summary = useMemo(
    () => computeAnalyticsSummary(filteredRecords),
    [filteredRecords],
  );
  const filterOptions = useMemo(() => getFilterOptions(records), [records]);
  const activeDistrict =
    summary.districtScores.find((item) => item.district === selectedDistrict) ??
    summary.districtScores[0];
  const trend = useMemo(
    () => getDistrictTrend(filteredRecords, activeDistrict?.district ?? ""),
    [filteredRecords, activeDistrict],
  );

  useEffect(() => {
    if (activeDistrict && activeDistrict.district !== selectedDistrict) {
      setSelectedDistrict(activeDistrict.district);
    }
  }, [activeDistrict, selectedDistrict, setSelectedDistrict]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">区域分析</div>
        <h2 className="mt-3 font-display text-2xl text-white sm:text-4xl">
          横向比较十八区表现，并放大查看单一区域短板
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          先用筛选器缩小分析范围，再点击区域卡片查看该行政区在不同场景下的下载速率、时延和投诉表现。
        </p>
      </section>

      <FilterBar
        filters={filters}
        options={filterOptions}
        onChange={setFilter}
        onReset={resetFilters}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <DistrictScorePanel
          items={summary.districtScores}
          selectedDistrict={activeDistrict?.district}
          onSelect={setSelectedDistrict}
        />

        {activeDistrict ? (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">区域详情</div>
            <h3 className="mt-2 font-display text-2xl text-white">{activeDistrict.district}</h3>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">综合得分</div>
                <div className="mt-2 font-display text-4xl text-cyan-100">{activeDistrict.score}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <div>平均下载：{activeDistrict.avgDownload} Mbps</div>
                <div className="mt-2">平均上传：{activeDistrict.avgUpload} Mbps</div>
                <div className="mt-2">平均时延：{activeDistrict.avgLatency} ms</div>
                <div className="mt-2">投诉率：{formatPercent(activeDistrict.complaintRate)}</div>
                <div className="mt-2">满意度：{formatPercent(activeDistrict.satisfactionRate)}</div>
                <div className="mt-2">重复反馈率：{formatPercent(activeDistrict.repeatedRate)}</div>
                <div className="mt-2">主要问题：{activeDistrict.topIssue}</div>
                <div className="mt-2">样本量：{activeDistrict.sampleSize}</div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <DistrictComparisonCharts
        scores={summary.districtScores}
        selectedDistrict={activeDistrict}
        trend={trend}
      />
    </div>
  );
}
