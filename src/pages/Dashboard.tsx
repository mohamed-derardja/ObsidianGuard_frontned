import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import AnalysisModules from "@/components/AnalysisModules";
import StatsSection from "@/components/StatsSection";

const Dashboard = () => (
  <div className="flex min-h-screen bg-background">
    <DashboardSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <DashboardTopBar />
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analysis Dashboard</h1>
          <p className="text-sm text-muted-foreground">Scan emails, URLs, screenshots & files for phishing threats</p>
        </div>
        <AnalysisModules />
        <StatsSection />
      </main>
    </div>
  </div>
);

export default Dashboard;
