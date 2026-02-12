import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import AnalysisModules from "@/components/AnalysisModules";
import StatsSection from "@/components/StatsSection";
import DashboardBreadcrumbs from "@/components/DashboardBreadcrumbs";
import ProfileSettings from "@/components/ProfileSettings";
import { Briefcase, Brain, Globe, ShieldCheck, TrendingUp } from "lucide-react";

const routeToTab: Record<string, string> = {
  "/dashboard": "overview",
  "/dashboard/scan": "email",
  "/dashboard/email": "email",
  "/dashboard/url": "url",
  "/dashboard/domain": "domain",
  "/dashboard/visual": "visual",
  "/dashboard/files": "file",
  "/dashboard/reports": "classify",
  "/dashboard/settings": "overview",
};

const rolePanels = [
  {
    title: "Web Security Analyst",
    icon: Globe,
    permissions: "URL, Domain, SSL/WHOIS, Visual impersonation",
  },
  {
    title: "Threat Researcher",
    icon: TrendingUp,
    permissions: "Trend analytics, threat distribution, IOC correlation",
  },
  {
    title: "Moderator",
    icon: ShieldCheck,
    permissions: "Incident triage, block/report, review suspicious queue",
  },
  {
    title: "Context Manager",
    icon: Brain,
    permissions: "Email NLP, sender authenticity, language risk context",
  },
  {
    title: "Enterprise (Business Client)",
    icon: Briefcase,
    permissions: "Executive dashboard, multi-team visibility, governance",
  },
];

const Dashboard = () => {
  const location = useLocation();
  const initialTab = routeToTab[location.pathname] || "overview";
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOverview = location.pathname === "/dashboard";
  const isSettings = location.pathname === "/dashboard/settings";

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
          <div className="text-center max-w-2xl mx-auto pt-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Analysis <span className="text-gradient">Dashboard</span></h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Scan emails, URLs, screenshots & files for phishing threats in real-time</p>
          </div>

          {isSettings ? (
            <ProfileSettings />
          ) : (
            <>
              {isOverview && (
                <section aria-label="Role-Based Access Modules" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm md:text-base font-semibold">Role-Based Access Modules</h2>
                    <span className="text-xs text-muted-foreground">Permission-aware dashboards</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    {rolePanels.map((role) => (
                      <article key={role.title} className="glass-card p-4 border-primary/10">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                          <role.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold mb-2">{role.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{role.permissions}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <AnalysisModules syncedTab={initialTab} />
              <StatsSection />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
