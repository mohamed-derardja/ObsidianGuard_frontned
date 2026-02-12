import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import AnalysisModules from "@/components/AnalysisModules";
import StatsSection from "@/components/StatsSection";

const Dashboard = () => (
  <div className="flex min-h-screen bg-background">
    <DashboardSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <DashboardTopBar />
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        <div className="text-center max-w-2xl mx-auto pt-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Analysis <span className="text-gradient">Dashboard</span></h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Scan emails, URLs, screenshots & files for phishing threats in real-time</p>
        </div>
        <AnalysisModules />
        <StatsSection />
      </main>
    </div>
  </div>
);

export default Dashboard;
