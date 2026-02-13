import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle, ShieldBan, ArrowUpRight, RefreshCw, Loader2, Inbox } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { getDashboardStats, type DashboardStats } from "@/services/email.service";

const THREAT_COLORS: Record<string, string> = {
  danger: "hsl(0 72% 51%)",
  caution: "hsl(38 92% 55%)",
  safe: "hsl(150 60% 45%)",
  Unknown: "hsl(230 80% 62%)",
};

const StatsSection = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading dashboard data...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-16 space-y-3">
        <Inbox className="w-10 h-10 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Could not load dashboard statistics.</p>
        <button onClick={loadStats} className="text-xs text-primary hover:underline">Try again</button>
      </div>
    );
  }

  const { kpis, dailyStats, threatDistribution, recentAlerts } = stats;

  const kpiCards = [
    { label: "Total Messages Scanned", value: kpis.totalScanned.toLocaleString(), icon: ShieldCheck, color: "text-primary" },
    { label: "Suspicious Messages", value: kpis.suspiciousCount.toLocaleString(), icon: AlertTriangle, color: "text-warning" },
    { label: "Confirmed Phishing", value: kpis.confirmedPhishing.toLocaleString(), icon: XCircle, color: "text-danger" },
    { label: "Blocked & Protected", value: kpis.blockedProtected.toLocaleString(), icon: ShieldBan, color: "text-success" },
  ];

  const todayRate = dailyStats.length > 0 ? dailyStats[dailyStats.length - 1].detectionRate : 0;
  const maxRate = Math.max(...dailyStats.map(d => d.detectionRate), 10);

  const pieData = threatDistribution
    .filter(t => t.value > 0)
    .map(t => ({
      ...t,
      name: t.name.charAt(0).toUpperCase() + t.name.slice(1),
      color: THREAT_COLORS[t.name] || THREAT_COLORS.Unknown
    }));

  const totalPie = pieData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-5 mt-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-end">
        <button
          onClick={loadStats}
          disabled={loading}
          className="text-xs px-3 py-1.5 border border-border rounded-lg hover:border-primary/30 transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold font-mono">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Daily Detection Rate</h3>
              <p className="text-xs text-muted-foreground">Threat detection ratio over last 7 days</p>
            </div>
            <span className={`text-xs font-mono px-2 py-1 rounded-md ${todayRate > 0 ? 'text-warning bg-warning/10' : 'text-success bg-success/10'}`}>
              {todayRate}% today
            </span>
          </div>
          {dailyStats.some(d => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyStats}>
                <XAxis dataKey="day" tick={{ fill: "hsl(225 12% 48%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis unit="%" tick={{ fill: "hsl(225 12% 48%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, Math.ceil(maxRate * 1.2)]} />
                <Tooltip
                  contentStyle={{ background: "hsl(230 20% 8%)", border: "1px solid hsl(230 15% 15%)", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "hsl(220 20% 92%)" }}
                />
                <Line type="monotone" dataKey="detectionRate" stroke="hsl(190 90% 50%)" strokeWidth={2.5} dot={{ fill: "hsl(190 90% 50%)", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
              No analysis data in the last 7 days. Analyze some emails to see trends.
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-1">Threat Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">By recommendation category</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground flex-1">{d.name}</span>
                    <span className="font-mono font-medium">{totalPie > 0 ? Math.round((d.value / totalPie) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
              No analysis data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent Analysis Results</h3>
          <span className="text-xs text-muted-foreground">{recentAlerts.length} most recent</span>
        </div>
        {recentAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2.5 font-medium">Target</th>
                  <th className="text-left py-2.5 font-medium">Type</th>
                  <th className="text-left py-2.5 font-medium">Result</th>
                  <th className="text-right py-2.5 font-medium">Confidence</th>
                  <th className="text-right py-2.5 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((s) => (
                  <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-3 font-mono truncate max-w-[250px]">{s.target}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium">{s.type}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.result === "Phishing" ? "badge-phishing" : s.result === "Suspicious" ? "badge-suspicious" : "badge-safe"
                      }`}>{s.result}</span>
                    </td>
                    <td className="py-3 text-right font-mono">{s.confidence}</td>
                    <td className="py-3 text-right text-muted-foreground">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No emails analyzed yet. Go to the Email Analyzer to start scanning.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSection;
