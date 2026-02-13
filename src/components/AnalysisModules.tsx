import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import emailService, { Email, EmailStats, AnalysisResult } from "@/services/email.service";
import urlService, { UrlAnalysisResult, VisualMatch, UrlScanSummary } from "@/services/url.service";
import fileService, { FileScanResult, FileScanSummary, FileDetection } from "@/services/file.service";
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
  RefreshCw,
  BarChart3,
  Camera,
  Fingerprint,
  MapPin,
  Shield,
  Wifi,
  ExternalLink,
  Image,
} from "lucide-react";

const tabs = [
  { id: "email", label: "Email Analyzer", icon: Mail, route: "/dashboard/email" },
  { id: "url", label: "URL & Link", icon: Link2, route: "/dashboard/url" },
  { id: "domain", label: "Domain Analyzer", icon: Server, route: "/dashboard/domain" },
  { id: "visual", label: "Visual Checker", icon: Eye, route: "/dashboard/visual" },
  { id: "file", label: "Attachment Scanner", icon: FileSearch, route: "/dashboard/files" },
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
      </div>
    </div>
  );
};

/* ===== EMAIL PANEL ===== */
const EmailPanel = () => {
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("");
  const [result, setResult] = useState<null | "phishing" | "safe" | "suspicious">(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzedEmails, setAnalyzedEmails] = useState<Email[]>([]);
  const [activeTab, setActiveTab] = useState<"analyze" | "inbox" | "analyzed" | "stats">("analyze");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Check Gmail connection status on mount
  useEffect(() => {
    checkGmailStatus();
  }, []);

  const checkGmailStatus = async () => {
    try {
      const status = await emailService.getGmailStatus();
      setGmailConnected(status.connected);
      if (status.connected) {
        loadEmails();
        loadStats();
      }
    } catch {
      setGmailConnected(false);
    }
  };

  const connectGmail = async () => {
    try {
      const authUrl = await emailService.getGmailAuthUrl();
      console.log('Gmail auth URL:', authUrl);
      
      if (!authUrl) {
        toast.error("Failed to get Gmail authorization URL", { description: "Auth URL is empty" });
        return;
      }
      
      // Validate that it's a proper URL starting with http or https
      if (!authUrl.startsWith('http')) {
        toast.error("Invalid Gmail authorization URL", { description: `Got: ${authUrl.substring(0, 50)}...` });
        console.error('Invalid auth URL format:', authUrl);
        return;
      }
      
      window.location.href = authUrl;
    } catch (error) {
      toast.error("Failed to get Gmail authorization URL", { description: error instanceof Error ? error.message : "Unknown error" });
      console.error('Gmail connection error:', error);
    }
  };

  const disconnectGmail = async () => {
    try {
      await emailService.disconnectGmail();
      setGmailConnected(false);
      setEmails([]);
      setStats(null);
      toast.success("Gmail disconnected");
    } catch {
      toast.error("Failed to disconnect Gmail");
    }
  };

  const loadEmails = async () => {
    try {
      const data = await emailService.getEmails({ limit: 20, sortBy: "receivedAt", sortOrder: "desc" });
      if (data?.emails) {
        setEmails(data.emails);
      }
    } catch {
      console.error("Failed to load emails");
    }
  };

  const loadStats = async () => {
    try {
      const data = await emailService.getEmailStats();
      if (data) {
        // Ensure numeric fields are numbers (backend may return strings)
        setStats({
          ...data,
          totalEmails: Number(data.totalEmails) || 0,
          analyzedEmails: Number(data.analyzedEmails) || 0,
          phishingEmails: Number(data.phishingEmails) || 0,
          safeEmails: Number(data.safeEmails) || 0,
          suspiciousEmails: Number(data.suspiciousEmails) || 0,
          unreadEmails: Number(data.unreadEmails) || 0,
          averagePhishingScore: parseFloat(String(data.averagePhishingScore)) || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const syncEmails = async () => {
    setIsSyncing(true);
    try {
      const data = await emailService.syncGmailEmails({ maxResults: 50 });
      toast.success(`Synced ${data?.synced || 0} emails from Gmail`);
      loadEmails();
      loadStats();
    } catch {
      toast.error("Failed to sync emails from Gmail");
    } finally {
      setIsSyncing(false);
    }
  };

  const loadAnalyzedEmails = async () => {
    try {
      const data = await emailService.getEmails({ 
        limit: 50, 
        isAnalyzed: true, 
        sortBy: "analyzedAt", 
        sortOrder: "desc" 
      });
      if (data?.emails) {
        setAnalyzedEmails(data.emails);
      }
    } catch {
      console.error("Failed to load analyzed emails");
    }
  };

  const deleteAnalyzedEmail = async (emailId: number) => {
    if (!confirm('Are you sure you want to delete this email?')) {
      return;
    }
    
    setDeletingId(emailId);
    try {
      await emailService.deleteEmail(emailId);
      toast.success('Email deleted successfully');
      // Remove from analyzedEmails list
      setAnalyzedEmails(prev => prev.filter(e => e.id !== emailId));
    } catch (error) {
      toast.error('Failed to delete email', { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setDeletingId(null);
    }
  };

  const analyze = async () => {
    if (!text.trim()) {
      toast.warning("Please enter email content to analyze");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setAnalysisDetails(null);
    
    try {
      const analysis = await emailService.analyzeEmailContent({
        subject: subject || undefined,
        body: text,
        sender: sender || undefined,
      });
      
      if (analysis) {
        setAnalysisDetails(analysis);
        const score = analysis.phishingScore || 0;
        if (analysis.isPhishing || score >= 70) {
          setResult("phishing");
        } else if (score >= 40) {
          setResult("suspicious");
        } else {
          setResult("safe");
        }
        toast.success("Email analysis complete");
      }
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      // Fallback to simple local analysis
      const lower = text.toLowerCase();
      if (lower.includes("urgent") || lower.includes("password") || lower.includes("verify your account")) {
        setResult("phishing");
      } else if (lower.includes("offer") || lower.includes("click here")) {
        setResult("suspicious");
      } else {
        setResult("safe");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeStoredEmail = async (email: Email) => {
    setIsLoading(true);
    try {
      const data = await emailService.analyzeStoredEmail(email.id);
      if (data) {
        toast.success(`Email analyzed: ${data.analysis.isPhishing ? "Phishing detected!" : "Safe"}`);
        loadEmails();
        loadStats();
      }
    } catch {
      toast.error("Failed to analyze email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Gmail Connection Status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {gmailConnected ? (
            <>
              <span className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle className="w-4 h-4" /> Gmail Connected
              </span>
              <button onClick={disconnectGmail} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={connectGmail} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all flex items-center gap-2">
              <Mail className="w-4 h-4" /> Connect Gmail
            </button>
          )}
        </div>
        
        {gmailConnected && (
          <div className="flex items-center gap-2">
            <button 
              onClick={syncEmails} 
              disabled={isSyncing}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
              {isSyncing ? 'Syncing...' : 'Sync Emails'}
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
        {(["analyze", "inbox", "analyzed", "stats"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "analyzed") loadAnalyzedEmails();
              if (tab === "stats") loadStats();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? "bg-primary/10 text-primary border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "analyze" ? "Analyze Content" : tab === "inbox" ? `Inbox (${emails.length})` : tab === "analyzed" ? `Analyzed (${analyzedEmails.length})` : "Statistics"}
          </button>
        ))}
      </div>

      {/* Analyze Tab */}
      {activeTab === "analyze" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject (optional)</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Urgent: Verify your account"
                className="w-full bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sender (optional)</label>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="security@bank-verify.com"
                className="w-full bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email Body Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dear customer, your account has been compromised. Click the link below to verify your identity immediately..."
              className="w-full h-36 bg-muted/40 border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 font-mono transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => toast.info("File upload will connect to the backend API.")} className="px-6 py-2.5 rounded-lg border border-border text-sm font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload .eml/.msg
            </button>
            <button 
              onClick={analyze} 
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <><RefreshCw className="w-4 h-4 inline mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Search className="w-4 h-4 inline mr-2" /> Analyze Email</>
              )}
            </button>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Header Analysis</span>
              <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Sender Authenticity</span>
              <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> AI Language Detection</span>
            </div>
          </div>
          
          {/* Analysis Details */}
          {analysisDetails && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="glass-card p-3">
                  <p className="text-muted-foreground mb-1">Phishing Score</p>
                  <p className={`font-mono text-lg font-bold ${
                    (analysisDetails.phishingScore || 0) >= 70 ? 'text-destructive' : 
                    (analysisDetails.phishingScore || 0) >= 40 ? 'text-warning' : 'text-green-500'
                  }`}>
                    {analysisDetails.phishingScore?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-muted-foreground mb-1">Confidence</p>
                  <p className="font-mono text-lg font-bold">
                    {analysisDetails.confidence?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-muted-foreground mb-1">Risk Indicators</p>
                  <p className="font-mono text-lg font-bold">
                    {analysisDetails.indicators?.length || 0} found
                  </p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-muted-foreground mb-1">Verdict</p>
                  <p className={`font-mono font-semibold ${
                    analysisDetails.isPhishing ? 'text-destructive' : 'text-green-500'
                  }`}>
                    {analysisDetails.verdict || (analysisDetails.isPhishing ? '⚠️ Phishing Detected' : '✅ Appears Safe')}
                  </p>
                </div>
              </div>
              
              {/* Label & Recommendation */}
              {(analysisDetails.label || analysisDetails.reason) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {analysisDetails.label && (
                    <div className="glass-card p-3">
                      <p className="text-muted-foreground mb-1">Classification</p>
                      <p className={`font-mono font-semibold ${
                        analysisDetails.label === 'Phishing' ? 'text-destructive' :
                        analysisDetails.label === 'Uncertain' ? 'text-warning' : 'text-green-500'
                      }`}>
                        {analysisDetails.label}
                      </p>
                    </div>
                  )}
                  {analysisDetails.reason && (
                    <div className="glass-card p-3">
                      <p className="text-muted-foreground mb-1">Recommended Action</p>
                      <p className="font-mono text-muted-foreground">{analysisDetails.reason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Risk Indicators List */}
          {analysisDetails?.indicators && analysisDetails.indicators.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="font-semibold text-sm mb-3">Detected Risk Indicators</h4>
              <ul className="space-y-2">
                {analysisDetails.indicators.map((indicator, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {result && <ResultCard result={result} confidence={analysisDetails?.phishingScore || (result === "phishing" ? 96.4 : result === "suspicious" ? 72.1 : 12.3)} />}
        </>
      )}

      {/* Inbox Tab */}
      {activeTab === "inbox" && (
        <div className="space-y-3">
          {!gmailConnected ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">Connect your Gmail to view and analyze emails</p>
              <button onClick={connectGmail} className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-lg font-medium hover:bg-red-500/20 transition-all">
                Connect Gmail
              </button>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No emails synced yet</p>
              <button onClick={syncEmails} disabled={isSyncing} className="px-6 py-2.5 border border-border rounded-lg font-medium hover:border-primary/30 transition-all disabled:opacity-50">
                {isSyncing ? 'Syncing...' : 'Sync Emails Now'}
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {emails.map((email) => (
                <div 
                  key={email.id} 
                  className={`glass-card p-3 cursor-pointer hover:border-primary/30 transition-all ${!email.isRead ? 'border-l-2 border-l-primary' : ''}`}
                  onClick={() => setSelectedEmail(selectedEmail?.id === email.id ? null : email)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                          {email.senderName || email.sender}
                        </span>
                        {email.isAnalyzed && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            email.isPhishing ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'
                          }`}>
                            {email.isPhishing ? 'Phishing' : 'Safe'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground truncate">{email.subject || '(No subject)'}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{email.snippet}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(email.receivedAt).toLocaleDateString()}
                      </span>
                      {!email.isAnalyzed && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); analyzeStoredEmail(email); }}
                          disabled={isLoading}
                          className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                        >
                          Analyze
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded email details */}
                  {selectedEmail?.id === email.id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs space-y-2">
                        <p><span className="text-muted-foreground">From:</span> {email.sender}</p>
                        <p><span className="text-muted-foreground">Subject:</span> {email.subject}</p>
                        <p><span className="text-muted-foreground">Date:</span> {new Date(email.receivedAt).toLocaleString()}</p>
                        {email.isAnalyzed && (
                          <>
                            <p><span className="text-muted-foreground">Phishing Score:</span> {email.phishingScore?.toFixed(1)}%</p>
                            {email.indicators && email.indicators.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">Indicators:</span>
                                <ul className="mt-1 ml-4 list-disc">
                                  {email.indicators.slice(0, 3).map((ind, i) => (
                                    <li key={i} className="text-warning">{ind}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                        <div className="mt-2 p-2 bg-muted/40 rounded text-[11px] font-mono max-h-32 overflow-y-auto">
                          {email.body?.substring(0, 500) || email.snippet}
                          {email.body && email.body.length > 500 && '...'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analyzed Emails Tab */}
      {activeTab === "analyzed" && (
        <div className="space-y-3">
          {analyzedEmails.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No analyzed emails yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {analyzedEmails.map((email) => (
                <div 
                  key={email.id} 
                  className={`glass-card p-4 flex items-start gap-4 justify-between border-l-2 ${
                    email.isPhishing ? 'border-l-destructive' : 'border-l-green-500'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium truncate">
                        {email.senderName || email.sender}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        email.isPhishing ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {email.isPhishing ? '🚨 Phishing' : '✅ Safe'}
                      </span>
                    </div>
                    <p className="text-xs text-foreground truncate font-medium mb-1">{email.subject || '(No subject)'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Score: <span className={email.phishingScore && email.phishingScore >= 70 ? 'text-destructive' : 'text-green-500'}>
                          {email.phishingScore?.toFixed(1) || 0}%
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(email.analyzedAt || email.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedEmail(selectedEmail?.id === email.id ? null : email)}
                      className="text-[11px] px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      {selectedEmail?.id === email.id ? 'Hide' : 'Details'}
                    </button>
                    <button 
                      onClick={() => deleteAnalyzedEmail(email.id)}
                      disabled={deletingId === email.id}
                      className="text-[11px] px-2 py-1 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors disabled:opacity-50"
                      title="Delete email"
                    >
                      {deletingId === email.id ? '...' : 'Delete'}
                    </button>
                  </div>
                  
                  {/* Expanded details */}
                  {selectedEmail?.id === email.id && (
                    <div className="col-span-full mt-3 pt-3 border-t border-border">
                      <div className="text-xs space-y-2">
                        <p><span className="text-muted-foreground">From:</span> {email.sender}</p>
                        <p><span className="text-muted-foreground">Subject:</span> {email.subject}</p>
                        <p><span className="text-muted-foreground">Analyzed:</span> {new Date(email.analyzedAt || email.updatedAt).toLocaleString()}</p>
                        <p><span className="text-muted-foreground">Score:</span> {email.phishingScore?.toFixed(1)}%</p>
                        {email.indicators && email.indicators.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Risk Indicators:</span>
                            <ul className="mt-1 ml-4 list-disc">
                              {email.indicators.map((ind, i) => (
                                <li key={i} className="text-warning">{ind}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Email Analysis Statistics</h3>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 border border-border rounded hover:border-primary/30 transition-all disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {!stats ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {gmailConnected ? 'Loading statistics...' : 'Connect Gmail to view statistics'}
              </p>
            </div>
          ) : (
            <>
              {/* Primary Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card p-4 text-center hover:border-primary/20 transition-colors">
                  <p className="text-3xl font-bold">{stats.totalEmails}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Emails</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Synced from Gmail</p>
                </div>
                <div className="glass-card p-4 text-center hover:border-primary/20 transition-colors">
                  <p className="text-3xl font-bold text-primary">{stats.analyzedEmails}</p>
                  <p className="text-xs text-muted-foreground mt-1">Analyzed</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{stats.totalEmails > 0 ? ((stats.analyzedEmails / stats.totalEmails) * 100).toFixed(0) : 0}% coverage</p>
                </div>
                <div className="glass-card p-4 text-center hover:border-destructive/20 transition-colors">
                  <p className="text-3xl font-bold text-destructive">{stats.phishingEmails}</p>
                  <p className="text-xs text-muted-foreground mt-1">Phishing</p>
                  <p className="text-[10px] text-destructive mt-1">⚠️ Detected</p>
                </div>
                <div className="glass-card p-4 text-center hover:border-green-500/20 transition-colors">
                  <p className="text-3xl font-bold text-green-500">{stats.safeEmails}</p>
                  <p className="text-xs text-muted-foreground mt-1">Safe</p>
                  <p className="text-[10px] text-green-500 mt-1">✓ Verified</p>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="glass-card p-5 space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Analysis Overview
                </h4>
                
                <div className="space-y-3 text-xs">
                  {/* Average Phishing Score */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-muted-foreground">Average Phishing Score</span>
                      <span className={`font-semibold font-mono text-sm ${
                        (stats.averagePhishingScore || 0) >= 70 ? 'text-destructive' : 
                        (stats.averagePhishingScore || 0) >= 40 ? 'text-warning' : 
                        'text-green-500'
                      }`}>
                        {stats.averagePhishingScore?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          (stats.averagePhishingScore || 0) >= 70 ? 'bg-destructive' : 
                          (stats.averagePhishingScore || 0) >= 40 ? 'bg-warning' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${stats.averagePhishingScore || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Unread Emails */}
                  <div className="flex items-center justify-between py-2 border-t border-border pt-3">
                    <span className="text-muted-foreground">Unread Emails</span>
                    <span className="font-mono font-semibold">{stats.unreadEmails}</span>
                  </div>

                  {/* Suspicious Emails */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-muted-foreground">Suspicious Emails</span>
                    <span className="font-mono font-semibold text-warning">{stats.suspiciousEmails}</span>
                  </div>

                  {/* Analysis Coverage */}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-muted-foreground">Analysis Coverage</span>
                      <span className="font-mono font-semibold text-primary">
                        {stats.totalEmails > 0 ? ((stats.analyzedEmails / stats.totalEmails) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-all"
                        style={{ width: `${stats.totalEmails > 0 ? (stats.analyzedEmails / stats.totalEmails) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {stats.analyzedEmails} of {stats.totalEmails} emails analyzed
                    </p>
                  </div>
                </div>
              </div>

              {/* Threat Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="glass-card p-4">
                  <h4 className="font-semibold text-xs mb-3">Email Distribution</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Safe Emails</span>
                      </div>
                      <span className="font-semibold text-green-500">{stats.safeEmails}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <span className="text-muted-foreground">Suspicious</span>
                      </div>
                      <span className="font-semibold text-warning">{stats.suspiciousEmails}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-muted-foreground">Phishing</span>
                      </div>
                      <span className="font-semibold text-destructive">{stats.phishingEmails}</span>
                    </div>
                  </div>
                  
                  {/* Mini pie chart representation */}
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-green-500" 
                      style={{ width: stats.totalEmails > 0 ? `${(stats.safeEmails / stats.totalEmails) * 100}%` : '0%' }}
                    />
                    <div 
                      className="bg-warning" 
                      style={{ width: stats.totalEmails > 0 ? `${(stats.suspiciousEmails / stats.totalEmails) * 100}%` : '0%' }}
                    />
                    <div 
                      className="bg-destructive" 
                      style={{ width: stats.totalEmails > 0 ? `${(stats.phishingEmails / stats.totalEmails) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Detection Rate */}
                <div className="glass-card p-4">
                  <h4 className="font-semibold text-xs mb-3">Detection Metrics</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Threats Detected</span>
                      <span className="font-semibold text-destructive">
                        {stats.phishingEmails + stats.suspiciousEmails}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Detection Rate</span>
                      <span className="font-semibold text-warning">
                        {stats.analyzedEmails > 0 
                          ? (((stats.phishingEmails + stats.suspiciousEmails) / stats.analyzedEmails) * 100).toFixed(1) 
                          : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">Avg Score</span>
                      <span className="font-semibold font-mono">
                        {stats.averagePhishingScore?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Message */}
              {gmailConnected && stats.analyzedEmails === 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground">
                  <p>📊 No emails analyzed yet. Go to the "Analyze Content" tab or "Inbox" to analyze emails from your Gmail account.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ===== URL PANEL ===== */
const UrlPanel = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | "phishing" | "safe" | "suspicious">(null);
  const [analysis, setAnalysis] = useState<UrlAnalysisResult | null>(null);
  const [scanData, setScanData] = useState<{
    verdict: string;
    confidence: number;
    label: string;
    recommendation: string;
    indicators: string[];
    domainInfo: {
      domain: string;
      protocol: string;
      hasSSL: boolean;
      pathDepth: number;
      hasQueryParams: boolean;
      isSuspiciousTLD: boolean;
      domainLength: number;
      hasIPAddress: boolean;
      hasSubdomains: boolean;
      typosquatTargets: string[];
    };
  } | null>(null);
  const [scans, setScans] = useState<UrlScanSummary[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);

  // Load previous scans on mount
  useEffect(() => {
    const loadScans = async () => {
      setIsLoadingScans(true);
      try {
        const previousScans = await urlService.getScans();
        setScans(previousScans);
      } catch (err) {
        console.error('Failed to load scans:', err);
      } finally {
        setIsLoadingScans(false);
      }
    };
    loadScans();
  }, []);

  const deleteScan = async (scanId: number) => {
    try {
      const success = await urlService.deleteScan(scanId);
      if (success) {
        setScans(scans.filter(s => s.id !== scanId));
        toast.success('Scan deleted');
      } else {
        toast.error('Failed to delete scan');
      }
    } catch (err) {
      toast.error('Error deleting scan');
      console.error(err);
    }
  };

  const extractDomainInfo = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
      const hostname = parsed.hostname;
      const suspiciousTLDs = [".xyz", ".top", ".buzz", ".club", ".tk", ".ml", ".ga", ".cf", ".gq", ".pw"];
      const isSuspiciousTLD = suspiciousTLDs.some(tld => hostname.endsWith(tld));
      const hasIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
      const parts = hostname.split(".");
      const hasSubdomains = parts.length > 2 && !hasIPAddress;
      
      const knownBrands = ["paypal", "google", "amazon", "microsoft", "apple", "netflix", "facebook", "instagram", "twitter", "linkedin", "dropbox", "chase", "wellsfargo", "bankofamerica"];
      const typosquatTargets: string[] = [];
      const domainBase = parts.slice(0, -1).join("").toLowerCase();
      for (const brand of knownBrands) {
        if (domainBase !== brand && domainBase.includes(brand.slice(0, 4))) {
          const distance = levenshtein(domainBase, brand);
          if (distance > 0 && distance <= 3) typosquatTargets.push(brand);
        }
      }
      const leetMap: Record<string, string> = { "0": "o", "1": "l", "3": "e", "4": "a", "5": "s", "@": "a" };
      const decoded = domainBase.replace(/[013345@]/g, ch => leetMap[ch] || ch);
      if (decoded !== domainBase) {
        for (const brand of knownBrands) {
          if (decoded.includes(brand) && !typosquatTargets.includes(brand)) {
            typosquatTargets.push(brand);
          }
        }
      }

      return {
        domain: hostname, protocol: parsed.protocol.replace(":", ""),
        hasSSL: parsed.protocol === "https:",
        pathDepth: parsed.pathname.split("/").filter(Boolean).length,
        hasQueryParams: parsed.search.length > 1, isSuspiciousTLD,
        domainLength: hostname.length, hasIPAddress, hasSubdomains, typosquatTargets,
      };
    } catch {
      return {
        domain: rawUrl, protocol: "unknown", hasSSL: false, pathDepth: 0,
        hasQueryParams: false, isSuspiciousTLD: false, domainLength: rawUrl.length,
        hasIPAddress: false, hasSubdomains: false, typosquatTargets: [],
      };
    }
  };

  const levenshtein = (a: string, b: string): number => {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => 
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  };

  const analyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) { toast.warning("Enter a URL to analyze"); return; }
    
    setIsLoading(true);
    setResult(null);
    setScanData(null);
    setAnalysis(null);

    const domainInfo = extractDomainInfo(trimmed);

    try {
      // Call URL analysis API (screenshot + hash + intelligence)
      const urlAnalysis = await urlService.analyzeUrl(trimmed);
      setAnalysis(urlAnalysis);

      // If the backend says it's a trusted/known domain, short-circuit to safe
      if (urlAnalysis?.isTrusted) {
        setScanData({
          verdict: "LOW",
          confidence: 0,
          label: "Safe",
          recommendation: "This is a known trusted domain — no risk detected.",
          indicators: ["Trusted domain — no risk"],
          domainInfo,
        });
        setResult("safe");
        toast.success("URL analysis complete — trusted domain");
        // Reload scan history
        const updatedScans = await urlService.getScans();
        setScans(updatedScans);
        return;
      }

      // Also call predict API for ML-based analysis
      let mlAnalysis: AnalysisResult | undefined;
      try {
        mlAnalysis = await emailService.analyzeEmailContent({
          subject: `URL Analysis: ${domainInfo.domain}`,
          body: trimmed,
          content: trimmed,
        }) as AnalysisResult | undefined;
      } catch { /* ML API optional */ }

      // Combine scores
      const mlScore = mlAnalysis?.phishingScore || 0;
      const visualScore = urlAnalysis?.riskScore || 0;
      const combinedScore = Math.round(mlScore * 0.5 + visualScore * 0.5);
      
      const indicators: string[] = [...(mlAnalysis?.indicators || []), ...(urlAnalysis?.riskFactors || [])];
      if (!domainInfo.hasSSL) indicators.push("No SSL/TLS encryption detected");
      if (domainInfo.isSuspiciousTLD) indicators.push(`Suspicious TLD: .${domainInfo.domain.split(".").pop()}`);
      if (domainInfo.hasIPAddress) indicators.push("URL uses raw IP address instead of domain");
      if (domainInfo.typosquatTargets.length > 0) indicators.push(`Possible typosquat of: ${domainInfo.typosquatTargets.join(", ")}`);
      if (domainInfo.domainLength > 40) indicators.push("Unusually long domain name");

      // Deduplicate indicators
      const uniqueIndicators = [...new Set(indicators)];

      const verdict = urlAnalysis?.riskLevel || (combinedScore >= 60 ? "CRITICAL" : combinedScore >= 35 ? "HIGH" : combinedScore >= 15 ? "MEDIUM" : "LOW");
      const label = combinedScore >= 60 ? "Phishing" : combinedScore >= 35 ? "Suspicious" : "Safe";

      setScanData({
        verdict,
        confidence: combinedScore,
        label,
        recommendation: mlAnalysis?.reason || (urlAnalysis?.riskFactors?.[0]) || "No additional information",
        indicators: uniqueIndicators,
        domainInfo,
      });

      if (combinedScore >= 60) setResult("phishing");
      else if (combinedScore >= 35) setResult("suspicious");
      else setResult("safe");

      toast.success("URL analysis complete");
      
      // Reload scan history
      try {
        const updated = await urlService.getScans();
        setScans(updated);
      } catch {
        // Fail silently
      }
    } catch {
      // Fallback to local heuristic
      let localScore = 0;
      if (!domainInfo.hasSSL) localScore += 15;
      if (domainInfo.isSuspiciousTLD) localScore += 20;
      if (domainInfo.hasIPAddress) localScore += 25;
      if (domainInfo.typosquatTargets.length > 0) localScore += 30;
      if (domainInfo.domainLength > 40) localScore += 10;
      if (domainInfo.pathDepth > 4) localScore += 5;

      const indicators: string[] = [];
      if (!domainInfo.hasSSL) indicators.push("No SSL/TLS encryption detected");
      if (domainInfo.isSuspiciousTLD) indicators.push(`Suspicious TLD`);
      if (domainInfo.hasIPAddress) indicators.push("IP-based URL");
      if (domainInfo.typosquatTargets.length > 0) indicators.push(`Typosquat: ${domainInfo.typosquatTargets.join(", ")}`);
      if (indicators.length === 0) indicators.push("No significant threats detected locally");

      setScanData({
        verdict: localScore >= 50 ? "HIGH" : localScore >= 25 ? "MEDIUM" : "LOW",
        confidence: Math.min(localScore + 20, 99), label: localScore >= 50 ? "Phishing" : localScore >= 25 ? "Uncertain" : "Safe",
        recommendation: "Local heuristics analysis (API unavailable)", indicators, domainInfo,
      });

      if (localScore >= 50) setResult("phishing");
      else if (localScore >= 25) setResult("suspicious");
      else setResult("safe");
      toast.info("Scan completed with local analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const riskColor = (level: string) => {
    if (level === "CRITICAL" || level === "HIGH") return "text-destructive";
    if (level === "MEDIUM") return "text-warning";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">URL & Domain Scanner</h3>
            <p className="text-xs text-muted-foreground">Screenshot capture, visual phishing detection, DNS & URL intelligence</p>
          </div>
        </div>
        {scans.length > 0 && (
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">{scans.length}</p>
            <p className="text-xs text-muted-foreground">Scanned URLs</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="glass-card p-4">
        <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Target URL</label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && analyze()}
              placeholder="https://example.com/login"
              className="w-full bg-muted/40 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-mono transition-all"
              disabled={isLoading}
            />
          </div>
          <button onClick={analyze} disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
            {isLoading ? (<><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</>) : (<><Camera className="w-4 h-4" /> Scan & Screenshot</>)}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass-card p-8 text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Capturing screenshot & analyzing URL...</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Taking screenshot via Browserless, computing visual hash, querying DNS...</p>
          <div className="flex justify-center gap-1 mt-3">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && scanData && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Verdict Banner */}
          <ResultCard result={result} confidence={scanData.confidence} />

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Level</p>
              <p className={`font-mono font-bold text-sm ${riskColor(scanData.verdict)}`}>{scanData.verdict}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Score</p>
              <p className="font-mono font-bold text-sm">{scanData.confidence}%</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Classification</p>
              <p className={`font-mono font-bold text-sm ${
                scanData.label === "Phishing" ? "text-destructive" : scanData.label === "Suspicious" ? "text-warning" : "text-green-500"
              }`}>{scanData.label}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Analysis Time</p>
              <p className="font-mono font-bold text-sm">{analysis?.analysisTime || "N/A"}</p>
            </div>
          </div>

          {/* Screenshot + Visual Similarity (Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Screenshot Preview */}
            <div className="glass-card p-5">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-primary" /> Live Screenshot
              </h4>
              {analysis?.screenshot ? (
                <div className="relative rounded-lg overflow-hidden border border-border/50 bg-black/5">
                  <img
                    src={analysis.screenshot}
                    alt={`Screenshot of ${analysis.hostname}`}
                    className="w-full h-auto max-h-80 object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-[10px] font-mono text-white/80 truncate">{analysis.url}</p>
                  </div>
                </div>
              ) : analysis?.screenshotError ? (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-6 text-center">
                  <XCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Screenshot unavailable</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{analysis.screenshotError}</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-6 text-center">
                  <Image className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No screenshot data</p>
                </div>
              )}
              {analysis?.screenshotHash && (
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/30 rounded p-2">
                  <Fingerprint className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">pHash: {analysis.screenshotHash}</span>
                </div>
              )}
            </div>

            {/* Visual Similarity Matches */}
            <div className="glass-card p-5">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-warning" /> Visual Clone Detection
              </h4>
              {analysis?.visualMatches && analysis.visualMatches.length > 0 ? (
                <div className="space-y-2">
                  {analysis.visualMatches.slice(0, 6).map((match: VisualMatch, idx: number) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                      match.isLikelyClone ? "bg-red-500/10 border border-red-500/20" : "bg-muted/30"
                    }`}>
                      <div className="relative w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        {match.isLikelyClone && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{match.site}</span>
                          {match.isLikelyClone && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">CLONE</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">{match.domain}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg font-bold font-mono ${
                          match.similarity >= 75 ? "text-red-400" : match.similarity >= 60 ? "text-yellow-400" : "text-muted-foreground"
                        }`}>{match.similarity}%</p>
                        <p className="text-[9px] text-muted-foreground">similarity</p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Compared against {analysis.knownSitesCount} known site fingerprints
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-green-500/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No visual clones detected</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    Page doesn't visually match any known brand login pages
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* URL Intelligence + DNS Intelligence (Two column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL Intelligence */}
            <div className="glass-card p-5 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" /> URL Intelligence
              </h4>
              <InfoRow label="Hostname" value={analysis?.hostname || scanData.domainInfo.domain} />
              <InfoRow label="Protocol" value={scanData.domainInfo.protocol.toUpperCase()} status={scanData.domainInfo.hasSSL ? "safe" : "danger"} />
              <InfoRow label="SSL/TLS" value={scanData.domainInfo.hasSSL ? "Encrypted" : "Not Encrypted"} status={scanData.domainInfo.hasSSL ? "safe" : "danger"} />
              {analysis?.urlIntel?.ip && <InfoRow label="IP Address" value={analysis.urlIntel.ip} />}
              {analysis?.urlIntel?.ipInfo && (
                <>
                  <InfoRow label="Location" value={`${analysis.urlIntel.ipInfo.city}, ${analysis.urlIntel.ipInfo.country}`} />
                  <InfoRow label="ASN/Org" value={analysis.urlIntel.ipInfo.org || "Unknown"} />
                </>
              )}
              {analysis?.urlIntel?.headers?.server && (
                <InfoRow label="Server" value={analysis.urlIntel.headers.server} />
              )}
              {analysis?.urlIntel?.headers?.redirected && (
                <InfoRow label="Redirect" value="Yes" status="warning" />
              )}
              {analysis?.urlIntel?.headers?.statusCode && (
                <InfoRow label="HTTP Status" value={String(analysis.urlIntel.headers.statusCode)} status={analysis.urlIntel.headers.statusCode === 200 ? "safe" : "warning"} />
              )}
            </div>

            {/* DNS Intelligence */}
            <div className="glass-card p-5 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" /> DNS Intelligence
              </h4>
              {analysis?.dns ? (
                <>
                  <InfoRow label="A Records" value={analysis.dns.aRecords.length > 0 ? analysis.dns.aRecords.join(", ") : "None"} />
                  <InfoRow label="MX Records" value={analysis.dns.mxRecords.length > 0 ? analysis.dns.mxRecords.map(r => r.exchange).join(", ") : "None"} status={analysis.dns.mxRecords.length === 0 ? "warning" : "safe"} />
                  <InfoRow label="NS Records" value={analysis.dns.nsRecords.length > 0 ? analysis.dns.nsRecords.slice(0, 2).join(", ") : "None"} />
                  <InfoRow label="SPF Record" value={analysis.dns.hasSPF ? "Present" : "Missing"} status={analysis.dns.hasSPF ? "safe" : "danger"} />
                  <InfoRow label="DMARC" value={analysis.dns.hasDMARC ? "Present" : "Missing"} status={analysis.dns.hasDMARC ? "safe" : "danger"} />
                  {/* Security Score Bar */}
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Email Security Score</p>
                    {[
                      { label: "SPF", score: analysis.dns.hasSPF ? 100 : 0 },
                      { label: "DMARC", score: analysis.dns.hasDMARC ? 100 : 0 },
                      { label: "MX", score: analysis.dns.mxRecords.length > 0 ? 100 : 0 },
                    ].map(item => (
                      <div key={item.label} className="mb-2">
                        <div className="flex items-center justify-between text-[10px] mb-0.5">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-mono">{item.score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${item.score > 70 ? "bg-green-500" : item.score > 30 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <InfoRow label="Domain Length" value={`${scanData.domainInfo.domainLength} chars`} status={scanData.domainInfo.domainLength > 40 ? "warning" : "safe"} />
                  <InfoRow label="Subdomains" value={scanData.domainInfo.hasSubdomains ? "Yes" : "No"} status={scanData.domainInfo.hasSubdomains ? "warning" : "safe"} />
                  <InfoRow label="IP-based URL" value={scanData.domainInfo.hasIPAddress ? "Yes" : "No"} status={scanData.domainInfo.hasIPAddress ? "danger" : "safe"} />
                  <InfoRow label="Suspicious TLD" value={scanData.domainInfo.isSuspiciousTLD ? "Yes" : "No"} status={scanData.domainInfo.isSuspiciousTLD ? "danger" : "safe"} />
                  {scanData.domainInfo.typosquatTargets.length > 0 && (
                    <InfoRow label="Typosquat Target" value={scanData.domainInfo.typosquatTargets.join(", ")} status="danger" />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Risk Indicators */}
          {scanData.indicators.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-warning" /> Risk Indicators ({scanData.indicators.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scanData.indicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/30">
                    <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action */}
          {scanData.recommendation && (
            <div className={`glass-card p-4 border-l-4 ${
              result === "phishing" ? "border-l-red-500" : result === "suspicious" ? "border-l-yellow-500" : "border-l-green-500"
            }`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recommended Action</p>
              <p className="text-sm">{scanData.recommendation}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Scan History */}
      {scans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Scan History ({scans.length})
            </h4>
          </div>
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {scans.map((scan) => (
              <div key={scan.id} className="glass-card p-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{scan.url}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      scan.isTrusted ? "bg-green-500/20 text-green-600" : 
                      scan.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-600" :
                      scan.riskLevel === "HIGH" ? "bg-orange-500/20 text-orange-600" :
                      scan.riskLevel === "MEDIUM" ? "bg-yellow-500/20 text-yellow-600" :
                      "bg-green-500/20 text-green-600"
                    }`}>
                      {scan.isTrusted ? "Trusted" : scan.riskLevel}
                    </span>
                    {scan.topMatch && !scan.isTrusted && (
                      <span className="text-xs text-muted-foreground">
                        {scan.topSimilarity}% match: {scan.topMatch}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(scan.scannedAt).toLocaleDateString()} {new Date(scan.scannedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteScan(scan.id)}
                  className="ml-2 p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                  title="Delete scan"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="glass-card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h4 className="font-medium text-sm mb-1">No URL scanned yet</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Enter a URL to capture a live screenshot, detect visual phishing clones, analyze DNS records, and check URL intelligence.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {[
              { icon: Camera, label: "Screenshot" },
              { icon: Fingerprint, label: "Hash Compare" },
              { icon: Wifi, label: "DNS Intel" },
              { icon: MapPin, label: "IP Geoloc" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary/40" />
                </div>
                <span className="text-[9px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== DOMAIN PANEL ===== */
const DomainPanel = () => {
  const [domain, setDomain] = useState("");
  const [scanned, setScanned] = useState(false);

  const dnsQuality = [
    { label: "A", value: 100 },
    { label: "MX", value: 82 },
    { label: "SPF", value: 15 },
    { label: "DMARC", value: 8 },
    { label: "DKIM", value: 22 },
  ];

  const investigate = () => {
    if (!domain.trim()) { toast.error("Please enter a domain name."); return; }
    setScanned(true);
    toast.success(`Investigating ${domain}...`);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">Enter domain name</label>
        <div className="flex gap-3">
          <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && investigate()} placeholder="example.com" className="flex-1 bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-mono transition-all" />
          <button onClick={investigate} className="px-5 py-2.5 bg-gradient-brand text-primary-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            <Globe className="w-4 h-4 inline mr-1" />
            Investigate
          </button>
        </div>
      </div>

      {scanned && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>}

      {!scanned && (
        <div className="glass-card p-8 text-center">
          <Globe className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Enter a domain above and click Investigate to see results</p>
        </div>
      )}
    </div>
  );
};

/* ===== VISUAL PANEL ===== */
const VisualPanel = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file (PNG, JPG)."); return; }
    setUploaded(file.name);
    toast.success(`Analyzing ${file.name}...`);
  };

  return (
    <div className="space-y-5">
      <label className="text-sm font-medium mb-2 block">Analyze website screenshots for impersonation and visual fraud</label>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-primary/40"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-primary/40"); }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-primary/40"); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group"
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
        <p className="text-sm text-muted-foreground">{uploaded ? `Uploaded: ${uploaded}` : "Drag & drop screenshot or click to upload"}</p>
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
};

/* ===== FILE PANEL ===== */
const FilePanel = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<FileScanResult | null>(null);
  const [scans, setScans] = useState<FileScanSummary[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load scan history on mount
  useEffect(() => {
    (async () => {
      setIsLoadingScans(true);
      try {
        const data = await fileService.getScans();
        setScans(data);
      } catch (_) {}
      setIsLoadingScans(false);
    })();
  }, []);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setScanResult(null);
    setIsLoading(true);

    try {
      toast.info(`Uploading ${file.name} to VirusTotal...`);
      const result = await fileService.scanFile(file);
      setScanResult(result);
      toast.success(`Scan complete — ${result.threat?.label || "Clean"}`);

      // Reload scan history
      const updated = await fileService.getScans();
      setScans(updated);
    } catch (err: any) {
      toast.error(err.message || "File scan failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScan = async (scanId: number) => {
    try {
      await fileService.deleteScan(scanId);
      setScans((prev) => prev.filter((s) => s.id !== scanId));
      toast.success("Scan record deleted");
    } catch (_) {
      toast.error("Failed to delete scan");
    }
  };

  const threatColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "text-danger";
      case "MEDIUM":
        return "text-warning";
      case "LOW":
      case "CLEAN":
      default:
        return "text-success";
    }
  };

  const threatBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "badge-phishing";
      case "MEDIUM":
        return "badge-suspicious";
      case "LOW":
      case "CLEAN":
      default:
        return "badge-safe";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium block">
          Scan files for malware using VirusTotal ({">"}70 antivirus engines)
        </label>
        {scans.length > 0 && (
          <span className="text-xs text-muted-foreground font-mono">
            {scans.length} file{scans.length !== 1 ? "s" : ""} scanned
          </span>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => !isLoading && fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary/40");
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove("border-primary/40")}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary/40");
          if (e.dataTransfer.files[0] && !isLoading) handleFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/30 transition-colors cursor-pointer group ${
          isLoading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
        {isLoading ? (
          <>
            <RefreshCw className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
            <p className="text-sm text-primary font-medium">Scanning with VirusTotal...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Uploading & analyzing with 70+ engines (may take up to 2 minutes)
            </p>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
            <p className="text-sm text-muted-foreground">
              {selectedFile ? `Last: ${selectedFile.name}` : "Drag & drop any file to scan"}
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              EXE, PDF, DOCX, ZIP, APK, scripts, and more — up to 32 MB
            </p>
          </>
        )}
      </div>

      {/* Scan Result */}
      {scanResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Threat overview card */}
          <div
            className={`glass-card p-5 border ${
              scanResult.threat?.level === "CLEAN" || scanResult.threat?.level === "LOW"
                ? "border-success/20"
                : scanResult.threat?.level === "MEDIUM"
                ? "border-warning/20"
                : "border-danger/20"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Circular score */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-muted" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    strokeWidth="6"
                    strokeDasharray={`${(scanResult.threat?.score || 0) * 2.64} 264`}
                    strokeLinecap="round"
                    className={
                      scanResult.threat?.level === "CLEAN" || scanResult.threat?.level === "LOW"
                        ? "stroke-success"
                        : scanResult.threat?.level === "MEDIUM"
                        ? "stroke-warning"
                        : "stroke-danger"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold font-mono ${threatColor(scanResult.threat?.level || "CLEAN")}`}>
                    {scanResult.threat?.score || 0}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {scanResult.threat?.level === "CLEAN" || scanResult.threat?.level === "LOW" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : scanResult.threat?.level === "MEDIUM" ? (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger" />
                  )}
                  <span className={`${threatBadge(scanResult.threat?.level || "CLEAN")} text-xs font-bold px-3 py-1 rounded-full`}>
                    {scanResult.threat?.label || "Clean"}
                  </span>
                  {scanResult.fromCache && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Cached
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium truncate">{scanResult.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(scanResult.fileSize)} • {scanResult.fileType || scanResult.mimeType} • {scanResult.analysisTime}
                </p>
              </div>
            </div>

            {/* Detection stats bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">
                  {scanResult.maliciousCount + scanResult.suspiciousCount} / {scanResult.totalEngines} engines flagged
                </span>
                <span className="font-mono text-muted-foreground">
                  {scanResult.totalEngines} engines
                </span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
                {scanResult.maliciousCount > 0 && (
                  <div
                    className="h-full bg-danger"
                    style={{ width: `${(scanResult.maliciousCount / Math.max(scanResult.totalEngines, 1)) * 100}%` }}
                  />
                )}
                {scanResult.suspiciousCount > 0 && (
                  <div
                    className="h-full bg-warning"
                    style={{ width: `${(scanResult.suspiciousCount / Math.max(scanResult.totalEngines, 1)) * 100}%` }}
                  />
                )}
                {scanResult.harmlessCount + scanResult.undetectedCount > 0 && (
                  <div
                    className="h-full bg-success"
                    style={{
                      width: `${((scanResult.harmlessCount + scanResult.undetectedCount) / Math.max(scanResult.totalEngines, 1)) * 100}%`,
                    }}
                  />
                )}
              </div>
              <div className="flex gap-4 mt-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                  Malicious ({scanResult.maliciousCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-warning inline-block" />
                  Suspicious ({scanResult.suspiciousCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success inline-block" />
                  Clean ({scanResult.harmlessCount + scanResult.undetectedCount})
                </span>
              </div>
            </div>
          </div>

          {/* Hashes */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-semibold flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> File Hashes
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-12 flex-shrink-0">SHA-256</span>
                <span className="font-mono text-[10px] truncate">{scanResult.sha256}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-12 flex-shrink-0">MD5</span>
                <span className="font-mono text-[10px] truncate">{scanResult.md5}</span>
              </div>
            </div>
          </div>

          {/* Engine detections */}
          {scanResult.detections && scanResult.detections.length > 0 && (
            <div className="glass-card p-4 space-y-3">
              <h4 className="text-xs font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-danger" /> Engine Detections ({scanResult.detections.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
                {scanResult.detections.map((d: FileDetection, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 text-xs">
                    <span className="font-medium">{d.engine}</span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        d.category === "malicious" ? "badge-phishing" : "badge-suspicious"
                      }`}
                    >
                      {d.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {scanResult.tags && scanResult.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {scanResult.tags.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Scan History */}
      {scans.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="text-xs font-semibold flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Scan History
          </h4>
          <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
            {scans.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 group">
                {s.threatLevel === "CLEAN" || s.threatLevel === "LOW" ? (
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                ) : s.threatLevel === "MEDIUM" ? (
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-danger flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{s.fileName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatFileSize(s.fileSize)} • {s.maliciousCount}/{s.totalEngines} flagged •{" "}
                    {new Date(s.scannedAt).toLocaleDateString()}{" "}
                    {new Date(s.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`${threatBadge(s.threatLevel)} text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
                  {s.threatLabel}
                </span>
                <button
                  onClick={() => handleDeleteScan(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-danger"
                  title="Delete scan"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoadingScans && (
        <div className="text-center py-4">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-1">Loading scan history...</p>
        </div>
      )}
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
        <button onClick={() => toast.success("Threat blocked and reported successfully.")} className="px-5 py-2.5 bg-danger text-danger-foreground rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
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

export { EmailPanel, UrlPanel, DomainPanel, VisualPanel, FilePanel };
export default AnalysisModules;
