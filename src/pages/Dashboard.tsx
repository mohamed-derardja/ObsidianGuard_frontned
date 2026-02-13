import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import { EmailPanel, UrlPanel, FilePanel } from "@/components/AnalysisModules";
import StatsSection from "@/components/StatsSection";
import DashboardBreadcrumbs from "@/components/DashboardBreadcrumbs";
import ProfileSettings from "@/components/ProfileSettings";

const Dashboard = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = location.pathname;
  const isOverview = pathname === "/dashboard";
  const isSettings = pathname === "/dashboard/settings";

  const renderContent = () => {
    if (isSettings) return <ProfileSettings />;
    
    if (isOverview) {
      return (
        <>
          <div className="text-center max-w-2xl mx-auto pt-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Analysis <span className="text-gradient">Dashboard</span></h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Scan emails, URLs, screenshots & files for phishing threats in real-time</p>
          </div>

          <StatsSection />
        </>
      );
    }

    // Render specific panel based on route
    return (
      <>
        <div className="glass-card neon-border p-6">
          {pathname === "/dashboard/email" && <EmailPanel />}
          {pathname === "/dashboard/url" && <UrlPanel />}
          {pathname === "/dashboard/files" && <FilePanel />}
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main id="main-content" role="main" className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          <DashboardBreadcrumbs />
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
