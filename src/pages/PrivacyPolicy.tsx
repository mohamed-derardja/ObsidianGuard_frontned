import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Database, Lock, Users, Bell, Trash2, Globe } from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

const lastUpdated = "February 13, 2026";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "**Account Information:** When you register, we collect your email address, password (hashed and salted), and account type (User or Enterprise).",
      "**Analysis Data:** Emails, URLs, domains, screenshots, and files you submit for phishing analysis. This data is processed in real-time and is not stored permanently unless you explicitly save a report.",
      "**Usage Data:** We collect anonymized usage metrics such as pages visited, features used, analysis frequency, and session duration to improve our service.",
      "**Device Information:** Browser type, operating system, IP address, and device identifiers for security and fraud prevention purposes.",
      "**Enterprise Data:** For Enterprise accounts, employee email addresses added by administrators and associated activity reports (fetched emails, visited sites flagged for threats).",
    ],
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      "**Phishing Detection & Analysis:** Processing submitted content through our AI-powered detection engine to identify phishing threats, malware, brand impersonation, and suspicious patterns.",
      "**Threat Intelligence:** Aggregating anonymized threat data to improve detection accuracy and maintain up-to-date threat databases.",
      "**Enterprise Monitoring:** Providing Enterprise administrators with employee activity reports related to email security and suspicious site visits, as authorized by the organization.",
      "**Account Management:** Authenticating users, managing preferences, and delivering notifications about security alerts.",
      "**Service Improvement:** Analyzing usage patterns to enhance features, fix bugs, and optimize performance.",
    ],
  },
  {
    icon: Lock,
    title: "3. Data Security",
    content: [
      "All data transmitted between your browser and our servers is encrypted using TLS 1.3 encryption.",
      "Passwords are hashed using bcrypt with unique salts and are never stored in plaintext.",
      "Analysis data (emails, URLs, files) is processed in isolated sandboxed environments and purged after analysis unless explicitly saved.",
      "We implement role-based access controls (RBAC) to ensure only authorized personnel can access sensitive systems.",
      "Regular security audits and penetration testing are conducted to identify and remediate vulnerabilities.",
      "Two-factor authentication (2FA) is available for all accounts and recommended for Enterprise administrators.",
    ],
  },
  {
    icon: Users,
    title: "4. Data Sharing",
    content: [
      "**We do not sell your personal data** to third parties under any circumstances.",
      "Anonymized threat intelligence data may be shared with cybersecurity research partners to improve global phishing detection capabilities.",
      "Enterprise administrators can view activity reports for employees they have registered within their organization.",
      "We may disclose information if required by law, court order, or to protect the safety and security of our users and platform.",
    ],
  },
  {
    icon: Bell,
    title: "5. Notifications & Communications",
    content: [
      "Security alerts are sent when threats are detected in submitted content or when suspicious activity is identified on your account.",
      "Enterprise administrators receive reports on employee email and browsing activity as configured in their settings.",
      "You can manage notification preferences in your Profile Settings, including enabling or disabling email notifications.",
      "We may send service-related announcements about maintenance, security updates, or policy changes.",
    ],
  },
  {
    icon: Globe,
    title: "6. Cookies & Tracking",
    content: [
      "We use essential cookies for authentication, session management, and theme preferences (dark/light mode).",
      "We do not use third-party advertising cookies or tracking pixels.",
      "Analytics cookies are anonymized and used solely to understand how users interact with the platform.",
      "You can control cookie preferences through your browser settings.",
    ],
  },
  {
    icon: Trash2,
    title: "7. Data Retention & Deletion",
    content: [
      "Analysis data submitted for scanning is processed in real-time and automatically purged within 24 hours unless saved to a report.",
      "Account data is retained for the duration of your active account.",
      "You may request deletion of your account and all associated data by contacting us or through your Profile Settings.",
      "Enterprise employee data is managed by the Enterprise administrator and is deleted when the employee is removed from the organization.",
      "Upon account deletion, all personal data is permanently removed within 30 days.",
    ],
  },
  {
    icon: Shield,
    title: "8. Your Rights",
    content: [
      "**Access:** You have the right to request a copy of the personal data we hold about you.",
      "**Correction:** You can update your personal information at any time through your Profile Settings.",
      "**Deletion:** You can request the deletion of your account and associated data.",
      "**Portability:** You can export your analysis reports and data in standard formats (CSV, PDF).",
      "**Objection:** You can opt out of non-essential data processing by adjusting your notification and privacy settings.",
    ],
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Obsidian Guard" className="w-10 h-10 object-contain" />
          <span className="font-bold text-sm">Obsidian <span className="text-gradient">Guard</span></span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </header>

    {/* Content */}
    <main className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy <span className="text-gradient">Policy</span></h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            At Obsidian Guard, we are committed to protecting your privacy and ensuring the security of your data. 
            This policy explains how we collect, use, and safeguard your information when you use our phishing detection and analysis platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 md:p-8 space-y-4"
            >
              <h2 className="text-lg font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/10">
                    {item.split(/(\*\*.*?\*\*)/).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={k} className="text-foreground font-medium">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={k}>{part}</span>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>

        {/* Contact */}
        <div className="glass-card p-6 md:p-8 text-center space-y-3">
          <h2 className="text-lg font-bold">Questions or Concerns?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle your data, 
            please contact our team at <span className="text-primary font-medium">privacy@phishingdp.com</span>
          </p>
        </div>
      </motion.div>
    </main>
  </div>
);

export default PrivacyPolicy;
