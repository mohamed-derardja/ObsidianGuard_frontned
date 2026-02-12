import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Mail,
  Globe,
  Eye,
  FileSearch,
  Upload,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Link2,
  ShieldAlert,
  FileWarning,
  Server,
  Lock,
  Hash,
  Tag,
  BadgeCheck,
  Bot,
} from "lucide-react";

const tabs = [
  { id: "email", label: "Email Analyzer", icon: Mail, route: "/dashboard/email" },
  { id: "url", label: "URL & Link", icon: Link2, route: "/dashboard/url" },
  { id: "domain", label: "Domain Analyzer", icon: Server, route: "/dashboard/domain" },
  { id: "visual", label: "Visual Checker", icon: Eye, route: "/dashboard/visual" },
  { id: "file", label: "Attachment Scanner", icon: FileSearch, route: "/dashboard/files" },
  { id: "classify", label: "Classification", icon: Tag, route: "/dashboard/reports" },
];

const AnalysisModules = ({ syncedTab }: { syncedTab?: string }) => {
  const [active, setActive] = useState(syncedTab && syncedTab !== "overview" ? syncedTab : "email");
  const navigate = useNavigate();

  useEffect(() => {
    if (syncedTab && syncedTab !== "overview") {
      setActive(syncedTab);
    }
  }, [syncedTab]);

  const handleTabChange = (tabId: string, route: string) => {
    setActive(tabId);
    navigate(route, { replace: true });
  };

  return (
    <div className="glass-card neon-border overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-none" role="tablist" aria-label="Analysis modules">
        {tabs.map((t) => (
          <Tooltip key={t.id}>
            <TooltipTrigger asChild>
              <button
                role="tab"
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => handleTabChange(t.id, t.route)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active === t.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">
              <p>{t.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {active === "email" && <EmailPanel />}
        {active === "url" && <UrlPanel />}
        {active === "domain" && <DomainPanel />}
        {active === "visual" && <VisualPanel />}
        {active === "file" && <FilePanel />}
        {active === "classify" && <ClassifyPanel />}
      </div>
    </div>
  );
};

/* ===== EMAIL PANEL ===== */
const EmailPanel = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | "phishing" | "safe" | "suspicious">(null);

  const analyze = () => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    if (lower.includes("urgent") || lower.includes("password") || lower.includes("verify your account")) {
      setResult("phishing");
    } else if (lower.includes("offer") || lower.includes("click here")) {
      setResult("suspicious");
    } else {
      setResult("safe");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">Upload or paste email content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dear customer, your account has been compromised. Click the link below to verify your identity immediately..."
          className="w-full h-36 bg-muted/40 border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 font-mono transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-2.5 rounded-lg border border-border text-sm font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all">
          <Upload className="w-4 h-4 inline mr-2" />
          Upload .eml/.msg
        </button>
        <button onClick={analyze} className="px-6 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all">
          <Search className="w-4 h-4 inline mr-2" />
          Analyze Email
        </button>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Header Analysis</span>
          <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Sender Authenticity</span>
          <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> AI Language Detection</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="glass-card p-3">
          <p className="text-muted-foreground mb-1">Header Analysis</p>
          <p className="font-mono">SPF: SoftFail • DKIM: Missing</p>
        </div>
        <div className="glass-card p-3">
          <p className="text-muted-foreground mb-1">Sender Authenticity</p>
          <p className="font-mono text-warning">display-name spoofing detected</p>
        </div>
        <div className="glass-card p-3">
          <p className="text-muted-foreground mb-1">AI Risk Language</p>
          <p className="font-mono">urgency + credential request + link coercion</p>
        </div>
      </div>
      {result && <ResultCard result={result} confidence={result === "phishing" ? 96.4 : result === "suspicious" ? 72.1 : 12.3} />}
    </div>
  );
};

/* ===== URL PANEL ===== */
const UrlPanel = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | "phishing" | "safe" | "suspicious">(null);

  const analyze = () => {
    if (!url.trim()) return;
    if (url.includes("paypa1") || url.includes("g00gle") || url.includes("amaz0n")) {
      setResult("phishing");
    } else if (url.includes("bit.ly") || url.includes("tinyurl")) {
      setResult("suspicious");
    } else {
      setResult("safe");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">Enter URL to analyze</label>
        <div className="flex gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://paypa1-secure.com/login"
            className="flex-1 bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-mono transition-all"
          />
          <button onClick={analyze} className="px-5 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            <Search className="w-4 h-4 inline mr-1" />
            Scan URL
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <ResultCard result={result} confidence={result === "phishing" ? 94.7 : result === "suspicious" ? 68.2 : 8.5} />
          <div className="glass-card p-4 space-y-2.5 text-xs">
            <h4 className="font-semibold text-sm mb-3">URL Intelligence Report</h4>
            <InfoRow label="Risk Indicator" value={result === "phishing" ? "🚨 Phishing" : result === "suspicious" ? "⚠️ Suspicious" : "✅ Safe"} status={result === "phishing" ? "danger" : result === "suspicious" ? "warning" : "safe"} />
            <InfoRow label="Domain Reputation Score" value={result === "phishing" ? "11 / 100" : result === "suspicious" ? "54 / 100" : "92 / 100"} status={result === "phishing" ? "danger" : result === "suspicious" ? "warning" : "safe"} />
            <InfoRow label="SSL Certificate" value={result === "phishing" ? "Self-signed" : "DV - Valid"} status={result === "phishing" ? "danger" : "safe"} />
            <InfoRow label="WHOIS Created" value={result === "phishing" ? "2 days ago" : "6 years ago"} status={result === "phishing" ? "danger" : "safe"} />
            <InfoRow label="WHOIS Registrar" value={result === "phishing" ? "Unknown Registrar" : "Cloudflare Registrar"} status={result === "phishing" ? "warning" : "safe"} />
            <InfoRow label="Typosquatting" value="paypa1 → paypal" status="danger" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== DOMAIN PANEL ===== */
const DomainPanel = () => {
  const dnsQuality = [
    { label: "A", value: 100 },
    { label: "MX", value: 82 },
    { label: "SPF", value: 15 },
    { label: "DMARC", value: 8 },
    { label: "DKIM", value: 22 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">Enter domain name</label>
        <div className="flex gap-3">
          <input placeholder="example.com" className="flex-1 bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-mono transition-all" />
          <button className="px-5 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            <Globe className="w-4 h-4 inline mr-1" />
            Investigate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2"><Server className="w-4 h-4 text-primary" /> Domain Profile</h4>
          <InfoRow label="Registrar" value="GoDaddy LLC" />
          <InfoRow label="Domain Age" value="3 days" status="danger" />
          <InfoRow label="IP Address" value="185.234.72.18" />
          <InfoRow label="Blacklist Status" value="Listed (3 databases)" status="danger" />
          <InfoRow label="ASN" value="AS58061" status="warning" />
        </div>

        <div className="glass-card p-5 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> DNS Records Visualization</h4>
          {dnsQuality.map((record) => (
            <div key={record.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{record.label}</span>
                <span className="font-mono">{record.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${record.value > 70 ? "bg-success" : record.value > 30 ? "bg-warning" : "bg-danger"}`} style={{ width: `${record.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ===== VISUAL PANEL ===== */
const VisualPanel = () => (
  <div className="space-y-5">
    <label className="text-sm font-medium mb-2 block">Analyze website screenshots for impersonation and visual fraud</label>
    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group">
      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
      <p className="text-sm text-muted-foreground">Drag & drop screenshot or click to upload</p>
      <p className="text-xs text-muted-foreground/50 mt-1">PNG, JPG up to 10MB</p>
    </div>
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
          <Eye className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Detected: <span className="text-warning">97% visual similarity</span> with PayPal login page</p>
          <p className="text-xs text-muted-foreground mb-3">Perceptual comparison with known legitimate websites flags likely brand impersonation.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge-phishing px-2 py-1 rounded-md">Brand Impersonation</span>
            <span className="badge-suspicious px-2 py-1 rounded-md">Modified Logo</span>
            <span className="badge-phishing px-2 py-1 rounded-md">Fake Form Fields</span>
          </div>
        </div>
        <span className="text-2xl font-bold font-mono text-warning">97%</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <InfoTile label="Legitimate Brand" value="paypal.com" />
        <InfoTile label="Detected Host" value="paypa1-secure.com" />
        <InfoTile label="Visual Similarity Score" value="97 / 100" tone="warning" />
      </div>
    </div>
  </div>
);

/* ===== FILE PANEL ===== */
const FilePanel = () => (
  <div className="space-y-5">
    <label className="text-sm font-medium mb-2 block">Scan ZIP, PDF, and file attachments for malware behavior</label>
    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group">
      <FileSearch className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
      <p className="text-sm text-muted-foreground">Drag & drop ZIP, PDF, DOCX files</p>
      <p className="text-xs text-muted-foreground/50 mt-1">Malware detection + hash signature + sandbox preview</p>
    </div>
    <div className="glass-card p-5 space-y-4">
      <h4 className="text-sm font-semibold">Scan Results (Demo)</h4>
      <FileResult name="invoice_final.docx" size="245 KB" status="phishing" details="Macro threat detected • Embedded links to malicious domain" hash="SHA256: a3f2...8d4e" sandbox="Behavior: C2 beacon + credential exfil attempt" />
      <FileResult name="report.zip" size="1.2 MB" status="suspicious" details="Contains executable disguised as .pdf (report.pdf.exe)" hash="SHA256: b7c1...2f9a" sandbox="Behavior: unsigned binary dropped in temp path" />
      <FileResult name="quarterly_summary.pdf" size="890 KB" status="safe" details="No threats detected • Clean PDF document" hash="SHA256: 9e0d...5c3b" sandbox="Behavior: no runtime anomaly observed" />
    </div>
  </div>
);

const FileResult = ({
  name,
  size,
  status,
  details,
  hash,
  sandbox,
}: {
  name: string;
  size: string;
  status: string;
  details: string;
  hash: string;
  sandbox: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
    {status === "phishing" ? <FileWarning className="w-5 h-5 text-danger mt-0.5" /> : status === "suspicious" ? <ShieldAlert className="w-5 h-5 text-warning mt-0.5" /> : <CheckCircle className="w-5 h-5 text-success mt-0.5" />}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <p className="text-sm font-medium truncate">{name}</p>
        <span className="text-[10px] text-muted-foreground">{size}</span>
      </div>
      <p className={`text-xs ${status === "phishing" ? "text-danger" : status === "suspicious" ? "text-warning" : "text-success"}`}>{details}</p>
      <p className="text-[10px] text-muted-foreground font-mono mt-1">{hash}</p>
      <p className="text-[10px] text-muted-foreground mt-1">Sandbox Preview: {sandbox}</p>
    </div>
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
      status === "phishing" ? "badge-phishing" : status === "suspicious" ? "badge-suspicious" : "badge-safe"
    }`}>{status === "phishing" ? "Malicious" : status === "suspicious" ? "Suspicious" : "Clean"}</span>
  </div>
);

/* ===== CLASSIFY PANEL ===== */
const ClassifyPanel = () => (
  <div className="space-y-5">
    <label className="text-sm font-medium mb-2 block">Message Classification System</label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ClassifyCard label="✅ Safe" tone="safe" desc="No threats detected. Content is legitimate and verified." confidence={12} />
      <ClassifyCard label="⚠️ Suspicious" tone="suspicious" desc="Potential indicators found. Manual review recommended." confidence={68} />
      <ClassifyCard label="🚨 Phishing" tone="phishing" desc="High-confidence phishing detected. Block immediately." confidence={96} />
    </div>
    <div className="glass-card p-5">
      <h4 className="text-sm font-semibold mb-3">Recent Classifications</h4>
      <div className="space-y-2 text-xs">
        {[
          { msg: "Your SBI account has been locked...", label: "Phishing", conf: "98.1%" },
          { msg: "Meeting tomorrow at 3pm confirmed", label: "Safe", conf: "4.2%" },
          { msg: "Limited time offer: click here now!", label: "Suspicious", conf: "71.8%" },
          { msg: "Please verify your OTP: 482910", label: "Phishing", conf: "94.3%" },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
            <span className="flex-1 font-mono truncate">{c.msg}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              c.label === "Phishing" ? "badge-phishing" : c.label === "Suspicious" ? "badge-suspicious" : "badge-safe"
            }`}>{c.label}</span>
            <span className="font-mono w-14 text-right">{c.conf}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClassifyCard = ({
  label,
  tone,
  desc,
  confidence,
}: {
  label: string;
  tone: "safe" | "suspicious" | "phishing";
  desc: string;
  confidence: number;
}) => {
  const toneClass = tone === "safe" ? "bg-success" : tone === "suspicious" ? "bg-warning" : "bg-danger";
  const ringClass = tone === "safe" ? "border-success/20" : tone === "suspicious" ? "border-warning/20" : "border-danger/20";

  return (
  <div className={`glass-card p-5 border ${ringClass}`}>
    <p className="text-lg font-bold mb-1">{label}</p>
    <p className="text-xs text-muted-foreground mb-4">{desc}</p>
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${toneClass}`} style={{ width: `${confidence}%` }} />
    </div>
    <p className="text-xs text-muted-foreground mt-1.5 font-mono">Confidence: {confidence}%</p>
  </div>
  );
};

/* ===== RESULT CARD ===== */
const ResultCard = ({ result, confidence }: { result: "phishing" | "safe" | "suspicious"; confidence: number }) => {
  const config = {
    phishing: { color: "text-danger", badge: "badge-phishing", icon: XCircle, label: "PHISHING DETECTED", ring: "border-danger" },
    suspicious: { color: "text-warning", badge: "badge-suspicious", icon: AlertTriangle, label: "SUSPICIOUS", ring: "border-warning" },
    safe: { color: "text-success", badge: "badge-safe", icon: CheckCircle, label: "SAFE", ring: "border-success" },
  }[result];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 flex flex-col sm:flex-row items-center gap-6 border ${config.ring}/20`}
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="5" className="stroke-muted" />
          <circle
            cx="50" cy="50" r="42" fill="none" strokeWidth="5"
            strokeDasharray={`${confidence * 2.64} 264`}
            strokeLinecap="round"
            className={`${result === "phishing" ? "stroke-danger" : result === "suspicious" ? "stroke-warning" : "stroke-success"}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold font-mono ${config.color}`}>{confidence}%</span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
          <config.icon className={`w-5 h-5 ${config.color}`} />
          <span className={`${config.badge} text-xs font-bold px-3 py-1 rounded-full`}>{config.label}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {result === "phishing"
            ? "High-confidence phishing indicators detected. Do not interact with this content."
            : result === "suspicious"
            ? "Some suspicious patterns found. Exercise caution before proceeding."
            : "No significant threats detected. Content appears legitimate."}
        </p>
      </div>

      {result !== "safe" && (
        <button className="px-5 py-2.5 bg-danger text-danger-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
          Block & Report
        </button>
      )}
    </motion.div>
  );
};

/* ===== SHARED COMPONENTS ===== */
const InfoRow = ({ label, value, status }: { label: string; value: string; status?: string }) => (
  <div className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-mono ${status === "danger" ? "text-danger" : status === "warning" ? "text-warning" : status === "safe" ? "text-success" : ""}`}>{value}</span>
  </div>
);

const InfoTile = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warning";
}) => (
  <div className="rounded-lg bg-muted/30 border border-border/50 px-3 py-2.5">
    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
    <p className={`text-xs font-mono ${tone === "warning" ? "text-warning" : "text-foreground"}`}>{value}</p>
  </div>
);

export default AnalysisModules;
