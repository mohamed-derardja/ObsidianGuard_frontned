import { motion } from "framer-motion";
import { Globe, TrendingUp, ShieldCheck, Brain, Briefcase } from "lucide-react";

const roles = [
  {
    icon: Globe,
    title: "Web Security Analyst",
    desc: "Deep URL inspection, visual analysis, SSL verification, and domain reputation scoring.",
    scope: "Dashboard: URL + Domain + Visual",
    permissions: ["URL Analyzer", "WHOIS Preview", "SSL Risk Flags"],
    color: "from-primary to-info",
  },
  {
    icon: TrendingUp,
    title: "Threat Researcher",
    desc: "Trend analytics, attack pattern recognition, daily evolution tracking, and intelligence feeds.",
    scope: "Dashboard: Analytics + Intelligence",
    permissions: ["Threat Evolution", "Distribution Charts", "IOC Correlation"],
    color: "from-primary to-secondary",
  },
  {
    icon: ShieldCheck,
    title: "Moderator",
    desc: "Review flagged messages, approve or block content, manage incident reports with one-click actions.",
    scope: "Dashboard: Alerts + Cases",
    permissions: ["Case Triage", "Block & Report", "Policy Actions"],
    color: "from-success to-info",
  },
  {
    icon: Brain,
    title: "Context Manager",
    desc: "NLP-powered email tone analysis, urgency detection, and social engineering pattern identification.",
    scope: "Dashboard: Email + Context AI",
    permissions: ["Header Analysis", "Sender Authenticity", "Language Detection"],
    color: "from-secondary to-primary",
  },
  {
    icon: Briefcase,
    title: "Enterprise (Business Client)",
    desc: "Team-wide threat dashboards, API access, custom rules engine, and automated response workflows.",
    scope: "Dashboard: Executive + Multi-team",
    permissions: ["RBAC Controls", "Cross-team Reports", "Enterprise Monitoring"],
    color: "from-warning to-danger",
  },
];

const RoleCards = () => (
  <section id="roles" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3 block">Access Control</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Role-Based <span className="text-gradient">Intelligence</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Tailored dashboards and permissions for every security role in your organization.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {roles.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5 text-center group relative overflow-hidden"
          >
            {/* Subtle gradient accent on top */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${r.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
              <r.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-2">{r.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{r.desc}</p>
            <p className="text-[10px] uppercase tracking-wider text-primary/80 mb-3">{r.scope}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {r.permissions.map((permission) => (
                <span key={permission} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/70 text-muted-foreground border border-border/70">
                  {permission}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default RoleCards;
