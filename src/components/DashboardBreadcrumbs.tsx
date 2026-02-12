import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  scan: "Quick Scan",
  email: "Email Analyzer",
  url: "URL & Domain",
  domain: "Domain Intel",
  visual: "Visual Checker",
  files: "File Scanner",
  reports: "My Reports",
  settings: "Settings",
};

const DashboardBreadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {segments.slice(1).map((seg, i) => (
        <span key={seg} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          <span className={i === segments.length - 2 ? "text-foreground font-medium" : ""}>
            {labelMap[seg] || seg}
          </span>
        </span>
      ))}
    </nav>
  );
};

export default DashboardBreadcrumbs;
