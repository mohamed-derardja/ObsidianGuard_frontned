import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import {
  Users, UserPlus, Mail, Trash2, Globe, ShieldAlert, AlertTriangle,
  CheckCircle, Search, Download, Filter, Clock, Eye, Building2,
  LayoutDashboard, Settings, Sun, Moon, Menu, X, Bell, ChevronDown,
  LogOut, User, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

/* ───── Types ───── */
interface Employee {
  id: number;
  email: string;
  addedAt: string;
  status: "active" | "flagged" | "inactive";
}

interface ActivityLog {
  id: number;
  employeeEmail: string;
  type: "email" | "site";
  detail: string;
  risk: "safe" | "suspicious" | "phishing";
  timestamp: string;
}

/* ───── Demo data ───── */
const initialEmployees: Employee[] = [
  { id: 1, email: "ahmed.b@company.dz", addedAt: "2026-01-15", status: "active" },
  { id: 2, email: "fatima.k@company.dz", addedAt: "2026-01-20", status: "flagged" },
  { id: 3, email: "youcef.m@company.dz", addedAt: "2026-02-01", status: "active" },
  { id: 4, email: "sara.d@company.dz", addedAt: "2026-02-05", status: "inactive" },
];

const activityLogs: ActivityLog[] = [
  { id: 1, employeeEmail: "fatima.k@company.dz", type: "email", detail: "Opened phishing email from 'support@paypa1.com'", risk: "phishing", timestamp: "2 hours ago" },
  { id: 2, employeeEmail: "ahmed.b@company.dz", type: "site", detail: "Visited https://secure-bank-login.xyz", risk: "phishing", timestamp: "3 hours ago" },
  { id: 3, employeeEmail: "fatima.k@company.dz", type: "site", detail: "Visited https://bit.ly/3xR2kf (redirects to unknown)", risk: "suspicious", timestamp: "5 hours ago" },
  { id: 4, employeeEmail: "youcef.m@company.dz", type: "email", detail: "Received email with suspicious attachment invoice.pdf.exe", risk: "suspicious", timestamp: "6 hours ago" },
  { id: 5, employeeEmail: "ahmed.b@company.dz", type: "site", detail: "Visited https://mail.google.com", risk: "safe", timestamp: "8 hours ago" },
  { id: 6, employeeEmail: "sara.d@company.dz", type: "email", detail: "Received newsletter from trusted sender", risk: "safe", timestamp: "1 day ago" },
  { id: 7, employeeEmail: "fatima.k@company.dz", type: "email", detail: "Clicked link in 'Verify your account' email", risk: "phishing", timestamp: "1 day ago" },
  { id: 8, employeeEmail: "youcef.m@company.dz", type: "site", detail: "Visited https://linkedin.com/feed", risk: "safe", timestamp: "1 day ago" },
];

const riskConfig = {
  phishing: { color: "text-danger", bg: "bg-danger/10", badge: "badge-phishing", label: "Phishing" },
  suspicious: { color: "text-warning", bg: "bg-warning/10", badge: "badge-suspicious", label: "Suspicious" },
  safe: { color: "text-success", bg: "bg-success/10", badge: "badge-safe", label: "Safe" },
};

/* ───── Sidebar nav ───── */
const sidebarNav = [
  { icon: LayoutDashboard, label: "Overview", path: "/enterprise" },
  { icon: Users, label: "Employees", path: "/enterprise/employees" },
  { icon: Eye, label: "Activity Reports", path: "/enterprise/reports" },
  { icon: Settings, label: "Settings", path: "/enterprise/settings" },
];

/* ===== ENTERPRISE SIDEBAR ===== */
const EnterpriseSidebar = ({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const content = (isMobile: boolean) => (
    <>
      <div className="h-14 flex items-center justify-between gap-2 px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Phishing D&P" className="w-7 h-7 object-contain flex-shrink-0" />
          {(isMobile || !collapsed) && <span className="font-bold text-sm">Enterprise <span className="text-gradient">D&P</span></span>}
        </Link>
        {isMobile && (
          <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" aria-label="Close navigation">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto" aria-label="Enterprise navigation">
        {sidebarNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onMobileClose : undefined}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {(isMobile || !collapsed) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {!isMobile && (
        <button onClick={() => setCollapsed(!collapsed)} className="h-10 flex items-center justify-center border-t border-border text-muted-foreground hover:text-foreground transition-colors" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </>
  );

  return (
    <>
      <aside className={`hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-lg transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`} role="navigation" aria-label="Enterprise sidebar">
        {content(false)}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-[280px] flex flex-col bg-card border-r border-border z-50 md:hidden">
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ===== ENTERPRISE TOPBAR ===== */
const EnterpriseTopBar = ({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUser, setShowUser] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenuToggle} className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" aria-label="Open navigation menu">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="font-semibold">Enterprise Dashboard</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div ref={userRef} className="relative">
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="User menu">
            <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">E</div>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showUser ? "rotate-180" : ""}`} />
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">Enterprise Admin</p>
                <p className="text-xs text-muted-foreground">admin@company.dz</p>
              </div>
              <div className="py-1">
                <Link to="/enterprise/settings" onClick={() => setShowUser(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button onClick={() => { setShowUser(false); localStorage.removeItem("accountType"); toast.success("Signed out."); navigate("/login"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-muted/50 transition-colors w-full">
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

/* ===== OVERVIEW PAGE ===== */
const OverviewPage = ({ employees, logs }: { employees: Employee[]; logs: ActivityLog[] }) => {
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    flagged: employees.filter((e) => e.status === "flagged").length,
    threats: logs.filter((l) => l.risk === "phishing").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Enterprise <span className="text-gradient">Overview</span></h2>
        <p className="text-sm text-muted-foreground">Monitor your organization's security posture</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Employees", value: stats.total, icon: Users, color: "text-primary" },
          { label: "Active", value: stats.active, icon: CheckCircle, color: "text-success" },
          { label: "Flagged", value: stats.flagged, icon: AlertTriangle, color: "text-warning" },
          { label: "Threats Detected", value: stats.threats, icon: ShieldAlert, color: "text-danger" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold font-mono">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent threats */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-danger" />
          Recent Threats
        </h3>
        <div className="space-y-2">
          {logs.filter((l) => l.risk !== "safe").slice(0, 5).map((log) => {
            const rc = riskConfig[log.risk];
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                <div className={`w-8 h-8 rounded-lg ${rc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {log.type === "email" ? <Mail className={`w-4 h-4 ${rc.color}`} /> : <Globe className={`w-4 h-4 ${rc.color}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold">{log.employeeEmail}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rc.badge}`}>{rc.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.detail}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{log.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ===== EMPLOYEES PAGE ===== */
const EmployeesPage = ({ employees, setEmployees }: { employees: Employee[]; setEmployees: React.Dispatch<React.SetStateAction<Employee[]>> }) => {
  const [newEmail, setNewEmail] = useState("");

  const addEmployee = () => {
    if (!newEmail.trim()) { toast.error("Please enter an email address."); return; }
    if (!/\S+@\S+\.\S+/.test(newEmail)) { toast.error("Enter a valid email address."); return; }
    if (employees.some((e) => e.email === newEmail)) { toast.error("This employee is already added."); return; }
    setEmployees([...employees, { id: Date.now(), email: newEmail, addedAt: new Date().toISOString().split("T")[0], status: "active" }]);
    toast.success(`${newEmail} added successfully.`);
    setNewEmail("");
  };

  const removeEmployee = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees(employees.filter((e) => e.id !== id));
    toast.success(`${emp?.email} removed.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Manage <span className="text-gradient">Employees</span></h2>
        <p className="text-sm text-muted-foreground">Add employee emails to monitor their activity and receive threat reports</p>
      </div>

      {/* Add employee */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Add Employee Email
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEmployee()}
              placeholder="employee@company.dz"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          <button onClick={addEmployee} className="px-5 py-2.5 bg-gradient-brand text-white rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            <UserPlus className="w-4 h-4 inline mr-1.5" />
            Add
          </button>
        </div>
      </motion.div>

      {/* Employee list */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Employees ({employees.length})
          </h3>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {employees.map((emp) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    emp.status === "flagged" ? "bg-warning/10 text-warning" : emp.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {emp.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{emp.email}</p>
                    <p className="text-[10px] text-muted-foreground">Added {emp.addedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    emp.status === "flagged" ? "badge-suspicious" : emp.status === "active" ? "badge-safe" : "bg-muted text-muted-foreground"
                  }`}>
                    {emp.status}
                  </span>
                  <button onClick={() => removeEmployee(emp.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors" aria-label={`Remove ${emp.email}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {employees.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No employees added yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ===== REPORTS PAGE ===== */
const ReportsPage = ({ logs }: { logs: ActivityLog[] }) => {
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "phishing" | "suspicious" | "safe">("all");
  const [filterType, setFilterType] = useState<"all" | "email" | "site">("all");

  const filteredLogs = logs.filter((log) => {
    if (filterEmail && !log.employeeEmail.toLowerCase().includes(filterEmail.toLowerCase())) return false;
    if (filterRisk !== "all" && log.risk !== filterRisk) return false;
    if (filterType !== "all" && log.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Activity <span className="text-gradient">Reports</span></h2>
          <p className="text-sm text-muted-foreground">Monitor employee email activity and visited sites</p>
        </div>
        <button onClick={() => toast.success("Report exported as CSV.")} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Filter by employee email..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value as typeof filterRisk)} className="h-9 px-3 rounded-lg bg-muted/30 border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
          <option value="all">All Risks</option>
          <option value="phishing">Phishing</option>
          <option value="suspicious">Suspicious</option>
          <option value="safe">Safe</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)} className="h-9 px-3 rounded-lg bg-muted/30 border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
          <option value="all">All Types</option>
          <option value="email">Emails</option>
          <option value="site">Sites Visited</option>
        </select>
      </div>

      {/* Log entries */}
      <div className="glass-card p-6 space-y-3">
        <p className="text-xs text-muted-foreground">{filteredLogs.length} results</p>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No activity matches your filters</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const rc = riskConfig[log.risk];
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${rc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {log.type === "email" ? <Mail className={`w-4 h-4 ${rc.color}`} /> : <Globe className={`w-4 h-4 ${rc.color}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-xs font-semibold">{log.employeeEmail}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rc.badge}`}>{rc.label}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{log.type === "email" ? "Email" : "Site Visit"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{log.detail}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{log.timestamp}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== ENTERPRISE SETTINGS ===== */
const EnterpriseSettings = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold mb-1">Enterprise <span className="text-gradient">Settings</span></h2>
      <p className="text-sm text-muted-foreground">Manage your organization settings</p>
    </div>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Organization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Company Name</label>
          <input defaultValue="My Company" className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Admin Email</label>
          <input defaultValue="admin@company.dz" className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
        </div>
      </div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Security Policy</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Auto-block phishing emails</p>
            <p className="text-xs text-muted-foreground">Automatically quarantine detected phishing emails</p>
          </div>
          <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">Enabled</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Alert on suspicious sites</p>
            <p className="text-xs text-muted-foreground">Notify admin when employees visit flagged URLs</p>
          </div>
          <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">Enabled</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Weekly digest reports</p>
            <p className="text-xs text-muted-foreground">Send weekly summary of employee activity</p>
          </div>
          <span className="text-xs font-medium text-warning bg-warning/10 px-2.5 py-1 rounded-full">Disabled</span>
        </div>
      </div>
    </motion.div>
    <div className="flex justify-end">
      <button onClick={() => toast.success("Settings saved.")} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all neon-glow">
        Save Changes
      </button>
    </div>
  </div>
);

/* ===== MAIN ENTERPRISE DASHBOARD ===== */
const EnterpriseDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Route guard: redirect non-enterprise users
  useEffect(() => {
    const type = localStorage.getItem("accountType");
    if (type !== "enterprise") {
      toast.error("Access denied. Enterprise account required.");
      navigate("/login");
    }
  }, [navigate]);

  const page = location.pathname;

  return (
    <div className="flex min-h-screen bg-background">
      <EnterpriseSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <EnterpriseTopBar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          {page === "/enterprise/employees" ? (
            <EmployeesPage employees={employees} setEmployees={setEmployees} />
          ) : page === "/enterprise/reports" ? (
            <ReportsPage logs={activityLogs} />
          ) : page === "/enterprise/settings" ? (
            <EnterpriseSettings />
          ) : (
            <OverviewPage employees={employees} logs={activityLogs} />
          )}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
