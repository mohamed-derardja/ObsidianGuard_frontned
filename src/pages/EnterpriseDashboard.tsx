import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { companyService, Employee as ApiEmployee, CompanyProfile } from "@/services/company.service";
import { ApiError } from "@/services/api";
import {
  Users, UserPlus, Mail, Trash2, Globe, ShieldAlert, AlertTriangle,
  CheckCircle, Search, Download, Filter, Clock, Eye, Building2,
  LayoutDashboard, Settings, Sun, Moon, Menu, X, Bell, ChevronDown,
  LogOut, User, ChevronLeft, ChevronRight, Shield, RefreshCw, Loader2
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

/* ───── Types ───── */
interface Employee {
  id: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  extensionInstalled: boolean;
  invitedAt: string;
  respondedAt?: string;
  installedAt?: string;
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
const activityLogs: ActivityLog[] = [
  { id: 1, employeeEmail: "employee@company.com", type: "email", detail: "Opened phishing email from 'support@paypa1.com'", risk: "phishing", timestamp: "2 hours ago" },
  { id: 2, employeeEmail: "employee@company.com", type: "site", detail: "Visited https://secure-bank-login.xyz", risk: "phishing", timestamp: "3 hours ago" },
  { id: 3, employeeEmail: "employee@company.com", type: "site", detail: "Visited https://bit.ly/3xR2kf (redirects to unknown)", risk: "suspicious", timestamp: "5 hours ago" },
  { id: 4, employeeEmail: "employee@company.com", type: "email", detail: "Received email with suspicious attachment invoice.pdf.exe", risk: "suspicious", timestamp: "6 hours ago" },
  { id: 5, employeeEmail: "employee@company.com", type: "site", detail: "Visited https://mail.google.com", risk: "safe", timestamp: "8 hours ago" },
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
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Obsidian Guard" className="w-10 h-10 object-contain flex-shrink-0" />
          <span className="font-bold text-sm">Obsidian <span className="text-gradient">Guard</span></span>
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
  const { logout, user } = useAuth();
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
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-lg sticky top-0 z-40">
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
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-[100] overflow-hidden">
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
                <button onClick={async () => { setShowUser(false); await logout(); toast.success("Signed out."); navigate("/login"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-muted/50 transition-colors w-full">
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
const OverviewPage = ({ employees, logs, isLoading }: { employees: Employee[]; logs: ActivityLog[]; isLoading: boolean }) => {
  const stats = {
    total: employees.length,
    accepted: employees.filter((e) => e.status === "ACCEPTED").length,
    pending: employees.filter((e) => e.status === "PENDING").length,
    extensionInstalled: employees.filter((e) => e.extensionInstalled).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Enterprise <span className="text-gradient">Overview</span></h2>
        <p className="text-sm text-muted-foreground">Monitor your organization's security posture</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Invited", value: stats.total, icon: Users, color: "text-primary" },
              { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "text-success" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-warning" },
              { label: "Extension Installed", value: stats.extensionInstalled, icon: Shield, color: "text-info" },
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
              {logs.filter((l) => l.risk !== "safe").length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent threats detected</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ===== EMPLOYEES PAGE ===== */
const EmployeesPage = ({ employees, onRefresh, isLoading }: { employees: Employee[]; onRefresh: () => void; isLoading: boolean }) => {
  const [newEmail, setNewEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Please enter an email address.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (employees.some((e) => e.email.toLowerCase() === email.toLowerCase())) return "This employee is already invited.";
    return "";
  };

  const inviteEmployee = async () => {
    const error = validateEmail(newEmail);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    setIsSubmitting(true);
    try {
      await companyService.inviteEmployee({ email: newEmail.trim().toLowerCase() });
      toast.success(`Invitation sent to ${newEmail}`);
      setNewEmail("");
      onRefresh();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Failed to invite employee", { description: err.message });
      } else {
        toast.error("Failed to invite employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeEmployee = async (id: string) => {
    const emp = employees.find((e) => e.id === id);
    try {
      await companyService.deleteEmployee(id);
      toast.success(`${emp?.email} removed.`);
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
      onRefresh();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Failed to remove employee", { description: err.message });
      } else {
        toast.error("Failed to remove employee");
      }
    }
  };

  const resendInvitation = async (id: string) => {
    const emp = employees.find((e) => e.id === id);
    try {
      await companyService.resendInvitation(id);
      toast.success(`Invitation resent to ${emp?.email}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Failed to resend invitation", { description: err.message });
      } else {
        toast.error("Failed to resend invitation");
      }
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const selectAllEmployees = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const bulkRemoveEmployees = async () => {
    const employeesToRemove = employees.filter(emp => selectedEmployees.includes(emp.id));
    try {
      await Promise.all(selectedEmployees.map(id => companyService.deleteEmployee(id)));
      toast.success(`${employeesToRemove.length} employee(s) removed.`);
      setSelectedEmployees([]);
      onRefresh();
    } catch (err) {
      toast.error("Failed to remove some employees");
      onRefresh();
    }
  };

  const exportEmployees = () => {
    const csvContent = [
      "Email,Status,Invited At,Extension Installed",
      ...filteredEmployees.map(emp => `${emp.email},${emp.status},${emp.invitedAt},${emp.extensionInstalled}`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Employee list exported successfully.");
  };

  const filteredEmployees = employees.filter(emp => 
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status: Employee['status']) => {
    switch (status) {
      case "ACCEPTED": return { color: "text-success", bg: "bg-success/10", label: "Accepted" };
      case "PENDING": return { color: "text-warning", bg: "bg-warning/10", label: "Pending" };
      case "REJECTED": return { color: "text-danger", bg: "bg-danger/10", label: "Rejected" };
    }
  };

  // Clear bulk actions if no employees selected
  React.useEffect(() => {
    setShowBulkActions(selectedEmployees.length > 0);
  }, [selectedEmployees]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Manage <span className="text-gradient">Employees</span></h2>
          <p className="text-sm text-muted-foreground">Invite employees to monitor their activity and receive threat reports</p>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
          aria-label="Refresh employees"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Invite employee */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Invite Employee
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && !isSubmitting && inviteEmployee()}
                placeholder="employee@company.com"
                disabled={isSubmitting}
                className={`w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                  emailError 
                    ? "border-danger/50 focus:ring-danger/50 focus:border-danger/50" 
                    : "border-primary/10 focus:ring-primary/50 focus:border-primary/50"
                }`}
              />
            </div>
            <button 
              onClick={inviteEmployee} 
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-brand text-white rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Invite
            </button>
          </div>
          {emailError && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {emailError}
            </p>
          )}
        </div>
      </motion.div>

      {/* Employee list */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
        {/* Header with search and stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Employees ({filteredEmployees.length} of {employees.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Bulk actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary">
                  {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
                </p>
                <button
                  onClick={() => setSelectedEmployees([])}
                  className="px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium hover:bg-muted transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-xs text-muted-foreground font-medium">Bulk Actions:</span>
                
                <button
                  onClick={exportEmployees}
                  className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <Download className="w-3 h-3 inline mr-1" />
                  Export CSV
                </button>
                
                <button
                  onClick={bulkRemoveEmployees}
                  className="px-2 py-1 rounded bg-danger/10 text-danger text-xs font-medium hover:bg-danger/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3 inline mr-1" />
                  Remove
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          /* Employee list with selection */
          <div className="space-y-2">
            {filteredEmployees.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground border-b border-border/30">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onChange={selectAllEmployees}
                  className="w-3 h-3 rounded border-border bg-muted/50 text-primary focus:ring-primary/40 accent-primary"
                />
                <span>Select All</span>
              </div>
            )}
            
            <AnimatePresence>
              {filteredEmployees.map((emp) => {
                const statusConfig = getStatusConfig(emp.status);
                return (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedEmployees.includes(emp.id) 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-muted/20 border-border/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployeeSelection(emp.id)}
                        className="w-3 h-3 rounded border-border bg-muted/50 text-primary focus:ring-primary/40 accent-primary"
                      />
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                        {emp.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{emp.email}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-muted-foreground">Invited {new Date(emp.invitedAt).toLocaleDateString()}</p>
                          {emp.extensionInstalled && (
                            <span className="text-[10px] text-success flex items-center gap-0.5">
                              <Shield className="w-3 h-3" /> Extension installed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      
                      {/* Resend invitation button for pending */}
                      {emp.status === "PENDING" && (
                        <button 
                          onClick={() => resendInvitation(emp.id)} 
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" 
                          aria-label={`Resend invitation to ${emp.email}`}
                          title="Resend invitation"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      {/* Remove button */}
                      <button 
                        onClick={() => removeEmployee(emp.id)} 
                        className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors" 
                        aria-label={`Remove ${emp.email}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                {searchQuery ? (
                  <>
                    <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No employees found matching "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No employees invited yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Invite employees to start monitoring their security</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await companyService.getProfile();
      if (response.success && response.data) {
        setEmployees(response.data.employees || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      toast.error("Failed to load employee data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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
            <EmployeesPage employees={employees} onRefresh={fetchEmployees} isLoading={isLoading} />
          ) : page === "/enterprise/reports" ? (
            <ReportsPage logs={activityLogs} />
          ) : page === "/enterprise/settings" ? (
            <EnterpriseSettings />
          ) : (
            <OverviewPage employees={employees} logs={activityLogs} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
