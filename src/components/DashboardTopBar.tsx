import { Bell, ChevronDown, Activity } from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

const DashboardTopBar = () => (
  <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-lg">
    <div className="flex items-center gap-4">
      <div className="md:hidden flex items-center gap-2">
        <img src={logo} alt="Phishing D&P" className="w-6 h-6 object-contain" />
        <span className="font-bold text-sm">Phishing <span className="text-gradient">D&P</span></span>
      </div>
      <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
        <Activity className="w-4 h-4 text-success animate-pulse" />
        <span className="font-mono text-xs">12,847</span>
        <span>threats blocked in real-time</span>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="w-4 h-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
      </button>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
        <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">A</div>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  </header>
);

export default DashboardTopBar;
