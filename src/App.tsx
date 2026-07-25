import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import OverviewPage from "@/pages/OverviewPage";
import DistrictsPage from "@/pages/DistrictsPage";
import WorkspacePage from "@/pages/WorkspacePage";
import { useNetworkStore } from "@/store/useNetworkStore";

export default function App() {
  const datasetMeta = useNetworkStore((state) => state.datasetMeta);
  const resetToDemo = useNetworkStore((state) => state.resetToDemo);

  return (
    <BrowserRouter>
      <AppShell datasetMeta={datasetMeta} onResetDemo={resetToDemo}>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
