import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle, ShieldBan, TrendingUp } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const kpis = [
  { label: "Messages Scanned Today", value: "1,847", icon: ShieldCheck, color: "text-primary" },
  { label: "Suspicious Detected", value: "126", icon: AlertTriangle, color: "text-warning" },
  { label: "Dangerous (Phishing)", value: "43", icon: XCircle, color: "text-danger" },
  { label: "Blocked & Protected", value: "169", icon: ShieldBan, color: "text-success" },
];

const lineData = [
  { day: "Mon", scans: 1200, threats: 89 },
  { day: "Tue", scans: 1450, threats: 102 },
  { day: "Wed", scans: 1380, threats: 95 },
  { day: "Thu", scans: 1600, threats: 118 },
  { day: "Fri", scans: 1520, threats: 107 },
  { day: "Sat", scans: 980, threats: 64 },
  { day: "Sun", scans: 1847, threats: 126 },
];

const pieData = [
  { name: "Credential Phishing", value: 42, color: "hsl(0 72% 51%)" },
  { name: "URL Spoofing", value: 28, color: "hsl(45 93% 58%)" },
  { name: "Malware Attach.", value: 18, color: "hsl(183 100% 50%)" },
  { name: "BEC Scams", value: 12, color: "hsl(270 60% 60%)" },
];

const recentScans = [
  { target: "paypa1-secure.com/login", type: "URL", result: "Phishing", confidence: "94.7%" },
  { target: "Dear user, verify your OTP...", type: "Email", result: "Phishing", confidence: "96.4%" },
  { target: "invoice_final.docx", type: "File", result: "Suspicious", confidence: "72.1%" },
  { target: "amazon.in/order/12345", type: "URL", result: "Safe", confidence: "8.5%" },
  { target: "Your SBI account locked...", type: "Email", result: "Phishing", confidence: "98.1%" },
];

const StatsSection = () => (
  <div className="space-y-6 mt-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card-hover p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <k.icon className={`w-5 h-5 ${k.color}`} />
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          </div>
          <p className="text-2xl font-bold font-mono">{k.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line Chart */}
      <div className="lg:col-span-2 glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Daily Evolution</h3>
          <span className="text-xs text-success font-mono">+28% today</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220 50% 12%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", fontSize: 12 }}
              labelStyle={{ color: "hsl(200 100% 97%)" }}
            />
            <Line type="monotone" dataKey="scans" stroke="hsl(183 100% 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="threats" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Threat Breakdown</h3>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-muted-foreground flex-1">{d.name}</span>
              <span className="font-mono">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">Target</th>
              <th className="text-left py-2 font-medium">Type</th>
              <th className="text-left py-2 font-medium">Result</th>
              <th className="text-right py-2 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {recentScans.map((s, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-mono truncate max-w-[200px]">{s.target}</td>
                <td className="py-2.5 text-muted-foreground">{s.type}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.result === "Phishing" ? "badge-phishing" : s.result === "Suspicious" ? "badge-suspicious" : "badge-safe"
                  }`}>{s.result}</span>
                </td>
                <td className="py-2.5 text-right font-mono">{s.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default StatsSection;
