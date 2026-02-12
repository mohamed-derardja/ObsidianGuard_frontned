import { Bell, ChevronDown, Activity, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo_obsidian_root.svg";

interface DashboardTopBarProps {
  onMobileMenuToggle?: () => void;
}

const DashboardTopBar = ({ onMobileMenuToggle }: DashboardTopBarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-lg" role="banner">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <img src={logo} alt="Phishing D&P" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm">Phishing <span className="text-gradient">D&P</span></span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-success animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs">12,847</span>
          <span>threats blocked in real-time</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications (1 new)">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" aria-hidden="true" />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="User menu">
          <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">A</div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopBar;
