import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";
import AnalysisModules from "@/components/AnalysisModules";
import StatsSection from "@/components/StatsSection";
import { Briefcase, Brain, Globe, ShieldCheck, TrendingUp } from "lucide-react";

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

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold">Role-Based Access Modules</h2>
            <span className="text-xs text-muted-foreground">Permission-aware dashboards</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
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

        <AnalysisModules />
        <StatsSection />
      </main>
    </div>
  </div>
);

export default Dashboard;
