import { Suspense, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import {
  Shield, Radar, ArrowRight, CheckCircle, Lock, Brain, FileSearch,
  Activity, Radio, Package, Zap, Clock, Server, Headphones
} from "lucide-react";
import CyberGlobe3D from "@/components/CyberGlobe3D";

/* ===== NAVBAR ===== */
const LandingNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto flex items-center justify-between h-16 px-4">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">PhishSleuth</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#stats" className="hover:text-foreground transition-colors">Solutions</a>
        <a href="#cta" className="hover:text-foreground transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Log In
        </Link>
        <Link to="/dashboard" className="px-5 py-2 rounded-lg bg-gradient-brand text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
          Register
        </Link>
      </div>
    </div>
  </nav>
);

/* ===== HERO ===== */
const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Grid background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "linear-gradient(hsl(230 80% 62%) 1px, transparent 1px), linear-gradient(90deg, hsl(230 80% 62%) 1px, transparent 1px)",
      backgroundSize: "60px 60px"
    }} />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.06] rounded-full blur-[120px] pointer-events-none" />

    <div className="relative z-10 container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Text */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-success/20 bg-success/5 text-xs font-medium text-success mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            System Operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Secure Your{" "}
            <br />
            <span className="text-gradient">Digital Perimeter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          >
            AI-driven threat detection and phishing prevention in real-time. Stop attacks before they breach your network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
          >
            <Link
              to="/dashboard"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-lg neon-glow hover:scale-[1.03] transition-all duration-300"
            >
              <Radar className="w-5 h-5" />
              Start Free Scan
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:border-primary/30 transition-all duration-300"
            >
              View Live Demo
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right: 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden lg:block"
        >
          <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center text-muted-foreground text-sm">Loading 3D...</div>}>
            <CyberGlobe3D />
          </Suspense>
        </motion.div>
      </div>

      {/* Trust bar - centered below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-center mt-8 lg:mt-0"
      >
        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-5">Trusted by security teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/40">
          {[
            { icon: CheckCircle, name: "TechCorp" },
            { icon: Shield, name: "SecureNet" },
            { icon: Lock, name: "VaultInc" },
            { icon: Server, name: "GuardSys" },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-sm">
              <c.icon className="w-4 h-4" />
              <span className="font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ===== FEATURES ===== */
const features = [
  {
    icon: Radio,
    title: "Real-time Threat Detection",
    desc: "Continuous monitoring of network traffic with sub-millisecond anomaly detection algorithms.",
    badge: "Live Monitor Active",
    badgeColor: "text-success bg-success/10",
  },
  {
    icon: Brain,
    title: "AI Phishing Classification",
    desc: "Neural networks analyze email headers, content, and sender behavior to block sophisticated social engineering.",
    badge: "98% Accuracy Rate",
    badgeColor: "text-primary bg-primary/10",
  },
  {
    icon: Package,
    title: "File Sandboxing",
    desc: "Executes suspicious files in an isolated virtual environment to observe behavior before allowing access.",
    badge: "Isolated • Secure",
    badgeColor: "text-secondary bg-secondary/10",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Intelligent Defense Layer</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto">
          Our platform integrates three core pillars of modern cybersecurity into a single, seamless interface.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-7 group flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-3">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{f.desc}</p>
            <span className={`inline-flex items-center self-start text-xs font-medium px-3 py-1.5 rounded-full ${f.badgeColor}`}>
              {f.badge}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ===== STATS ===== */
const stats = [
  { value: "2.4M+", label: "Threats Blocked", icon: Shield },
  { value: "0.01s", label: "Response Time", icon: Zap },
  { value: "99.9%", label: "Uptime SLA", icon: Clock },
  { value: "24/7", label: "Expert Support", icon: Headphones },
];

const StatsBar = () => (
  <section id="stats" className="py-16 border-y border-border/50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className="text-3xl md:text-4xl font-bold font-mono text-gradient mb-1">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ===== CTA ===== */
const CTASection = () => (
  <section id="cta" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-border overflow-hidden"
      >
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-secondary/[0.08]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.06] rounded-full blur-[100px]" />

        <div className="relative p-12 md:p-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to fortify your business?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of companies using PhishSleuth to protect their most valuable digital assets.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-lg neon-glow hover:scale-[1.03] transition-all duration-300"
          >
            Get Started
          </Link>
          <p className="text-xs text-muted-foreground mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ===== FOOTER ===== */
const LandingFooter = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold">PhishSleuth</span>
      </div>
      <div className="flex gap-6 text-xs text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-foreground transition-colors">Security</a>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 PhishSleuth Inc. All rights reserved.</p>
    </div>
  </footer>
);

/* ===== PAGE ===== */
const LandingPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <div className="min-h-screen bg-background">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <StatsBar />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
