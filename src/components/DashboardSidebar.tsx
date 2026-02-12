import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Zap, Mail, Globe, FileSearch, ClipboardList, Settings, Shield,
  ChevronLeft, ChevronRight, Eye, Server
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Zap, label: "Quick Scan", path: "/dashboard/scan" },
  { icon: Mail, label: "Email Analyzer", path: "/dashboard/email" },
  { icon: Globe, label: "URL & Domain", path: "/dashboard/url" },
  { icon: Server, label: "Domain Intel", path: "/dashboard/domain" },
  { icon: Eye, label: "Visual Checker", path: "/dashboard/visual" },
  { icon: FileSearch, label: "File Scanner", path: "/dashboard/files" },
  { icon: ClipboardList, label: "My Reports", path: "/dashboard/reports" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-[hsl(var(--sidebar-background))] border-r border-border"
    >
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-sm">Phish<span className="text-gradient">Sleuth</span></span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard");
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary font-medium border border-primary/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-3 p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};

export default DashboardSidebar;
