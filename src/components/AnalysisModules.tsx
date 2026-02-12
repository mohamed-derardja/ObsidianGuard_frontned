import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Globe, Eye, FileSearch, Upload, Search, AlertTriangle,
  CheckCircle, XCircle, Link2, ShieldAlert, FileWarning
} from "lucide-react";

const tabs = [
  { id: "email", label: "Email Analyzer", icon: Mail },
  { id: "url", label: "URL & Domain", icon: Globe },
  { id: "visual", label: "Visual Checker", icon: Eye },
  { id: "file", label: "File Scanner", icon: FileSearch },
];

const AnalysisModules = () => {
  const [active, setActive] = useState("email");

  return (
    <div className="glass-card neon-border">
      {/* Tab Bar */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              active === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {active === "email" && <EmailPanel />}
        {active === "url" && <UrlPanel />}
        {active === "visual" && <VisualPanel />}
        {active === "file" && <FilePanel />}
      </div>
    </div>
  );
};

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
        <label className="text-sm font-medium mb-2 block">Paste or type email content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dear customer, your account has been compromised. Click the link below to verify your identity immediately..."
          className="w-full h-36 bg-muted/50 border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50 font-mono"
        />
      </div>
      <button onClick={analyze} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:shadow-[0_0_25px_hsl(183_100%_50%/0.3)] transition-all">
        <Search className="w-4 h-4 inline mr-2" />
        Analyze Email
      </button>

      {result && <ResultCard result={result} confidence={result === "phishing" ? 96.4 : result === "suspicious" ? 72.1 : 12.3} />}
    </div>
  );
};

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
            className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 font-mono"
          />
          <button onClick={analyze} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:shadow-[0_0_25px_hsl(183_100%_50%/0.3)] transition-all">
            <Link2 className="w-4 h-4 inline mr-1" />
            Scan
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <ResultCard result={result} confidence={result === "phishing" ? 94.7 : result === "suspicious" ? 68.2 : 8.5} />
          {result !== "safe" && (
            <div className="glass-card p-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Domain Mismatch</span><span className="text-danger font-mono">Detected</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Homograph Attack</span><span className="text-warning font-mono">Likely</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Entropy Score</span><span className="font-mono">8.72</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Typosquatting</span><span className="text-danger font-mono">paypa1 → paypal</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VisualPanel = () => (
  <div className="space-y-5">
    <label className="text-sm font-medium mb-2 block">Upload a screenshot to compare</label>
    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/40 transition-colors cursor-pointer">
      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Drag & drop screenshot or click to upload</p>
      <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</p>
    </div>
    <div className="glass-card p-5 flex items-center gap-4">
      <Eye className="w-8 h-8 text-warning" />
      <div>
        <p className="text-sm font-medium">Demo Result: <span className="text-warning">97% visual match</span> with real PayPal login page</p>
        <p className="text-xs text-muted-foreground">Perceptual hash comparison detected near-identical visual layout</p>
      </div>
    </div>
  </div>
);

const FilePanel = () => (
  <div className="space-y-5">
    <label className="text-sm font-medium mb-2 block">Upload suspicious attachments</label>
    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/40 transition-colors cursor-pointer">
      <FileSearch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Drag & drop ZIP, PDF, DOCX</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Scans inside archives for hidden threats</p>
    </div>
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <FileWarning className="w-5 h-5 text-danger" />
        <div className="flex-1">
          <p className="text-sm font-medium">invoice_final.docx</p>
          <p className="text-xs text-danger">Macro threat detected • Embedded links found</p>
        </div>
        <span className="badge-phishing text-xs px-2 py-1 rounded-full">Malicious</span>
      </div>
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-warning" />
        <div className="flex-1">
          <p className="text-sm font-medium">report.zip</p>
          <p className="text-xs text-warning">Contains executable file (.exe disguised as .pdf)</p>
        </div>
        <span className="badge-suspicious text-xs px-2 py-1 rounded-full">Suspicious</span>
      </div>
    </div>
  </div>
);

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
      className={`glass-card p-6 flex flex-col sm:flex-row items-center gap-6 border ${config.ring}/30`}
    >
      {/* Circular progress */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-muted" />
          <circle
            cx="50" cy="50" r="42" fill="none" strokeWidth="6"
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
        <button className="px-5 py-2.5 bg-danger text-danger-foreground rounded-lg font-semibold text-sm whitespace-nowrap">
          Block & Report
        </button>
      )}
    </motion.div>
  );
};

export default AnalysisModules;
