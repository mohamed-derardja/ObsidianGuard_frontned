import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-cyber.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      </div>

      {/* Animated radar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.06] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-primary/30" />
        <div className="absolute inset-[60px] rounded-full border border-primary/20" />
        <div className="absolute inset-[120px] rounded-full border border-primary/10" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, hsl(230 80% 62% / 0.15) 60deg, transparent 120deg)",
            animation: "radar-sweep 4s linear infinite",
          }}
        />
      </div>

      <div className="absolute inset-0 scan-line pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium text-primary mb-8"
        >
          <Radar className="w-3.5 h-3.5 animate-glow-pulse" />
          AI-Powered Cybersecurity Platform • Real-Time Threat Detection
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6"
        >
          Detect. Analyze.
          <br />
          <span className="text-gradient">Protect.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Advanced AI that scans emails, analyzes URLs, checks attachments, and detects brand impersonation — all in real-time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-lg neon-glow hover:scale-[1.03] transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Start Free Analysis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:border-primary/30 transition-all duration-300"
          >
            <Shield className="w-5 h-5" />
            Explore Features
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm"
        >
          {[
            { value: "2.4M+", label: "Threats Blocked" },
            { value: "99.7%", label: "Detection Rate" },
            { value: "<200ms", label: "Scan Speed" },
            { value: "24/7", label: "Monitoring" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold font-mono text-gradient">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
