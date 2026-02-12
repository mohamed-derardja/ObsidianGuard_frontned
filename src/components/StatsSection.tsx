import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle, ShieldBan, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

const kpis = [
  { label: "Total Messages Scanned", value: "1,847", icon: ShieldCheck, color: "text-primary", trend: "+12%", up: true },
  { label: "Suspicious Messages Count", value: "126", icon: AlertTriangle, color: "text-warning", trend: "+28%", up: true },
  { label: "Confirmed Phishing/Damage Cases", value: "43", icon: XCircle, color: "text-danger", trend: "+6%", up: true },
  { label: "Blocked & Protected Actions", value: "169", icon: ShieldBan, color: "text-success", trend: "+18%", up: true },
];

const lineData = [
  { day: "Mon", detectionRate: 12 },
  { day: "Tue", detectionRate: 14 },
  { day: "Wed", detectionRate: 11 },
  { day: "Thu", detectionRate: 16 },
  { day: "Fri", detectionRate: 18 },
  { day: "Sat", detectionRate: 13 },
  { day: "Sun", detectionRate: 19 },
];

const pieData = [
  { name: "Credential Phishing", value: 42, color: "hsl(0 72% 51%)" },
  { name: "URL Spoofing", value: 28, color: "hsl(38 92% 55%)" },
  { name: "Malware Attachments", value: 18, color: "hsl(230 80% 62%)" },
  { name: "BEC Scams", value: 12, color: "hsl(270 60% 55%)" },
];

const recentAlerts = [
  { target: "paypa1-secure.com/login", type: "URL", result: "Phishing", confidence: "94.7%", time: "2m ago" },
  { target: "Dear user, verify your OTP...", type: "Email", result: "Phishing", confidence: "96.4%", time: "5m ago" },
  { target: "invoice_final.docx", type: "File", result: "Suspicious", confidence: "72.1%", time: "8m ago" },
  { target: "amazon.in/order/12345", type: "URL", result: "Safe", confidence: "8.5%", time: "12m ago" },
  { target: "Your SBI account locked...", type: "Email", result: "Phishing", confidence: "98.1%", time: "15m ago" },
  { target: "meeting-notes.pdf", type: "File", result: "Safe", confidence: "3.2%", time: "18m ago" },
];

const StatsSection = () => (
  <div className="space-y-5 mt-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
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
            <span className={`flex items-center gap-0.5 text-xs font-mono ${k.up ? "text-success" : "text-danger"}`}>
              {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {k.trend}
            </span>
          </div>
          <p className="text-2xl font-bold font-mono">{k.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Area Chart */}
      <div className="lg:col-span-2 glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">Daily Detection Percentage Evolution</h3>
            <p className="text-xs text-muted-foreground">Threat detection ratio by day</p>
          </div>
          <span className="text-xs text-success font-mono bg-success/10 px-2 py-1 rounded-md">19% today</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData}>
            <XAxis dataKey="day" tick={{ fill: "hsl(225 12% 48%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis unit="%" tick={{ fill: "hsl(225 12% 48%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 25]} />
            <Tooltip
              contentStyle={{ background: "hsl(230 20% 8%)", border: "1px solid hsl(230 15% 15%)", borderRadius: "8px", fontSize: 12 }}
              labelStyle={{ color: "hsl(220 20% 92%)" }}
            />
            <Line type="monotone" dataKey="detectionRate" stroke="hsl(190 90% 50%)" strokeWidth={2.5} dot={{ fill: "hsl(190 90% 50%)", r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-1">Threat Type Distribution</h3>
        <p className="text-xs text-muted-foreground mb-4">By attack type</p>
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
              <span className="font-mono font-medium">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Alerts Table */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Recent Alerts</h3>
        <button className="text-xs text-primary hover:underline">View All →</button>
      </div>
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
            {recentAlerts.map((s, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
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
    </div>
  </div>
);

export default StatsSection;
