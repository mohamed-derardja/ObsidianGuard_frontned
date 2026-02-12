import { motion } from "framer-motion";
import {
  Radar, Brain, FileSearch, Globe, Eye, Shield, Briefcase,
} from "lucide-react";

const features = [
  { icon: Radar, title: "Real-Time Threat Detection", desc: "Instant scanning of incoming emails, messages, and web links with sub-200ms response times." },
  { icon: Brain, title: "AI Phishing Classification", desc: "Machine learning models trained on millions of phishing samples for 99.7% accuracy." },
  { icon: FileSearch, title: "File & Attachment Sandboxing", desc: "Deep inspection of ZIP, PDF, DOCX files. Detects macros, embedded links, and disguised executables." },
  { icon: Globe, title: "Domain Intelligence", desc: "WHOIS lookup, DNS records, SSL analysis, domain age checks, and blacklist status verification." },
  { icon: Eye, title: "Visual Impersonation Detection", desc: "Perceptual hashing and screenshot comparison to detect brand impersonation with pixel-level analysis." },
  { icon: Shield, title: "Enterprise Threat Monitoring", desc: "Role-based dashboards, team analytics, API integration, and automated incident response workflows." },
];

const FeatureCards = () => (
  <section id="features" className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Platform Capabilities</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Everything You Need to
          <br />
          <span className="text-gradient">Stay Protected</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Six powerful analysis engines working together to detect and neutralize phishing threats.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-7 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-brand/10 border border-primary/10 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_hsl(230_80%_62%/0.15)] transition-all duration-300">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureCards;
