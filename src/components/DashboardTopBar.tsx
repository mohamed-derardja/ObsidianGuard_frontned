import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Activity, Menu, Sun, Moon, User, Settings, LogOut, ShieldAlert, AlertTriangle, CheckCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import logo from "@/assets/logo_obsidian_root.svg";

interface DashboardTopBarProps {
  onMobileMenuToggle?: () => void;
}

const notifications = [
  { id: 1, icon: ShieldAlert, text: "Phishing email blocked from unknown sender", time: "2 min ago", read: false, color: "text-danger" },
  { id: 2, icon: AlertTriangle, text: "Suspicious URL detected in scan queue", time: "15 min ago", read: false, color: "text-warning" },
  { id: 3, icon: CheckCircle, text: "Domain scan completed — no threats found", time: "1 hour ago", read: true, color: "text-success" },
];

const DashboardTopBar = ({ onMobileMenuToggle }: DashboardTopBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <img src={logo} alt="Obsidian Guard" className="w-9 h-9 object-contain" />
          <span className="font-bold text-sm">Obsidian <span className="text-gradient">Guard</span></span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-success animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs">12,847</span>
          <span>threats blocked in real-time</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Notifications (${unreadCount} new)`}
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" aria-hidden="true" />}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && <span className="text-xs text-primary font-medium">{unreadCount} new</span>}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${!n.read ? "bg-primary/[0.03]" : ""}`}>
                    <n.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button onClick={() => { setShowNotif(false); toast.info("All notifications marked as read."); }} className="text-xs text-primary font-medium hover:underline w-full text-center">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">A</div>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showUser ? "rotate-180" : ""}`} />
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@phishingdp.com</p>
              </div>
              <div className="py-1">
                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowUser(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowUser(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={() => { setShowUser(false); toast.success("Signed out successfully."); navigate("/login"); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-muted/50 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
