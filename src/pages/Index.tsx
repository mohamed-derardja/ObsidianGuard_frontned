import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import RoleCards from "@/components/RoleCards";
import {
  Shield, Radar, ArrowRight, CheckCircle, Lock, Brain, FileSearch,
  Activity, Radio, Package, Zap, Clock, Server, Headphones, Eye
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

/* ===== NAVBAR ===== */
const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-2xl" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Phishing Detect & Protect" className="w-12 h-12 object-contain" />
          <span className="text-lg font-bold tracking-tight">Phishing <span className="text-gradient">D&P</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">Features</a>
          <a href="#roles" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">Roles</a>
          <a href="#stats" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">Analytics</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-lg bg-gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

/* ===== HERO ===== */
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Motion values for smooth cursor tracking (simplified)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 30, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 30, mass: 0.8 });

  // Simplified parallax layers — only grid + glows + shield tilt
  const gridX = useTransform(springX, [-1, 1], [6, -6]);
  const gridY = useTransform(springY, [-1, 1], [6, -6]);
  const glowAx = useTransform(springX, [-1, 1], [-18, 18]);
  const glowAy = useTransform(springY, [-1, 1], [-14, 14]);
  const glowBx = useTransform(springX, [-1, 1], [14, -14]);
  const glowBy = useTransform(springY, [-1, 1], [10, -10]);
  const shieldRotY = useTransform(springX, [-1, 1], [-8, 8]);
  const shieldRotX = useTransform(springY, [-1, 1], [6, -6]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
  <section
    ref={sectionRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    className="relative min-h-screen flex items-center pt-16 pb-12 overflow-hidden"
  >
    {/* Grid background — smooth parallax */}
    <motion.div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: "linear-gradient(hsl(190 85% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 85% 48%) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        x: gridX,
        y: gridY,
      }}
    />
    {/* Ambient glows — drift with cursor */}
    <motion.div
      className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[hsl(190_85%_48%/0.04)] rounded-full blur-[150px] pointer-events-none"
      style={{ x: glowAx, y: glowAy }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(260_70%_55%/0.03)] rounded-full blur-[130px] pointer-events-none"
      style={{ x: glowBx, y: glowBy }}
    />

    <div className="relative z-10 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ─── Left: text content ─── */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            System Operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            Secure Your{" "}
            <br />
            <span className="text-gradient">Digital Perimeter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto"
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
              to="/register"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-brand text-white font-bold text-lg neon-glow hover:scale-[1.03] transition-all duration-300"
            >
              <Radar className="w-5 h-5" />
              Start Free Scan
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border/60 text-foreground font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              View Live Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-4">Trusted by security teams at</p>
            <div className="flex flex-wrap items-center lg:justify-start justify-center gap-6 text-muted-foreground/40">
              {[
                { icon: CheckCircle, name: "Sonatrach" },
                { icon: Shield, name: "Djezzy" },
                { icon: Lock, name: "Algerie Telecom" },
                { icon: Server, name: "USTHB" },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <c.icon className="w-4 h-4" />
                  <span className="font-medium">{c.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Right: 3D shield visual — smooth spring parallax ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center relative"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px]"
            style={{ rotateY: shieldRotY, rotateX: shieldRotX, transformStyle: "preserve-3d" }}
          >
            {/* Outer glow ring — breathing animation */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[hsl(190_85%_48%/0.04)] blur-[60px]"
            />

            {/* Orbiting ring 1 */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-primary/10"
              style={{ transform: "rotateX(65deg)" }}
            />

            {/* Orbiting ring 2 */}
            <motion.div
              animate={{ rotateZ: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-dashed border-primary/[0.07]"
              style={{ transform: "rotateX(65deg) rotateZ(45deg)" }}
            />

            {/* Orbiting ring 3 (vertical) */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-[hsl(260_70%_55%/0.08)]"
              style={{ transform: "rotateY(70deg)" }}
            />

            {/* Center 3D shield */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              <motion.div
                animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, 5, 0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Shield shape — SVG clip for proper silhouette */}
                <div className="w-32 h-38 sm:w-40 sm:h-48 lg:w-48 lg:h-56 relative">
                  <svg viewBox="0 0 200 240" className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 40px rgba(56,189,248,0.12))" }}>
                    <defs>
                      <clipPath id="shield-clip">
                        <path d="M100 8 L185 50 C185 50 182 175 100 232 C18 175 15 50 15 50 Z" />
                      </clipPath>
                      <linearGradient id="shield-grad-back" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(190 85% 48%)" stopOpacity="0.12" />
                        <stop offset="50%" stopColor="hsl(225 65% 42%)" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="hsl(260 70% 55%)" stopOpacity="0.12" />
                      </linearGradient>
                      <linearGradient id="shield-grad-front" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="hsl(190 85% 48%)" stopOpacity="0.18" />
                        <stop offset="40%" stopColor="hsl(210 60% 45%)" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="hsl(260 70% 55%)" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    {/* Back face */}
                    <g style={{ transform: "translateZ(-6px)" }}>
                      <path d="M100 8 L185 50 C185 50 182 175 100 232 C18 175 15 50 15 50 Z" fill="url(#shield-grad-back)" stroke="hsl(190 85% 48%)" strokeOpacity="0.2" strokeWidth="1.2" />
                    </g>
                    {/* Front face */}
                    <path d="M100 8 L185 50 C185 50 182 175 100 232 C18 175 15 50 15 50 Z" fill="url(#shield-grad-front)" stroke="hsl(190 85% 48%)" strokeOpacity="0.3" strokeWidth="1.5" />
                    {/* Inner edge highlight */}
                    <path d="M100 22 L172 58 C172 58 170 168 100 220 C30 168 28 58 28 58 Z" fill="none" stroke="hsl(190 85% 48%)" strokeOpacity="0.08" strokeWidth="0.8" />
                  </svg>

                  {/* Logo in center */}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "8%" }}>
                    <img
                      src={logo}
                      alt="Shield Logo"
                      className="w-60 h-60 sm:w-72 sm:h-72 lg:w-[22rem] lg:h-[22rem] object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.45)] opacity-90"
                    />
                  </div>

                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 overflow-hidden">
                    <svg viewBox="0 0 200 240" className="absolute inset-0 w-full h-full">
                      <defs>
                        <clipPath id="shield-clip-shimmer">
                          <path d="M100 8 L185 50 C185 50 182 175 100 232 C18 175 15 50 15 50 Z" />
                        </clipPath>
                      </defs>
                      <g clipPath="url(#shield-clip-shimmer)">
                        <motion.rect
                          x="-60"
                          y="0"
                          width="80"
                          height="240"
                          fill="white"
                          fillOpacity="0.04"
                          style={{ transform: "skewX(-20deg)" }}
                          animate={{ x: [-60, 260] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating threat dots */}
            {[
              { top: "15%", left: "20%", delay: 0, color: "bg-red-400" },
              { top: "70%", left: "15%", delay: 1.2, color: "bg-orange-400" },
              { top: "25%", left: "80%", delay: 2.5, color: "bg-yellow-400" },
              { top: "75%", left: "78%", delay: 0.6, color: "bg-red-400" },
              { top: "50%", left: "8%", delay: 3.0, color: "bg-orange-400" },
              { top: "45%", left: "90%", delay: 1.8, color: "bg-yellow-400" },
            ].map((dot, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 0.8, 1, 0.8, 0],
                  scale: [0.4, 1, 1.2, 1, 0.4],
                }}
                transition={{
                  delay: dot.delay,
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className={`absolute w-2 h-2 rounded-full ${dot.color} shadow-[0_0_8px_currentColor]`}
                style={{ top: dot.top, left: dot.left }}
              />
            ))}

            {/* Scanning sweep — the only rotating overlay kept for visual interest */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[15%] rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, hsl(190 80% 50% / 0.06) 60deg, transparent 120deg)",
              }}
            />

            {/* Status label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-[65%] translate-y-full mt-3 z-10"
            >
              <div className="relative group">
                {/* Glow behind badge */}
                <div className="absolute inset-0 rounded-full bg-[hsl(160_80%_50%/0.15)] blur-[12px] group-hover:blur-[16px] transition-all" />
                <div className="relative flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-400/30 bg-background/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {/* Animated dot with ring */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400/60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-300 tracking-wide">Threat Shield Active</span>
                  <Shield className="w-3.5 h-3.5 text-emerald-400/70" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  </section>
  );
};

/* ===== FEATURES ===== */
const features = [
  {
    icon: Radio,
    title: "Real-time Threat Detection",
    desc: "Continuous monitoring of network traffic with sub-millisecond anomaly detection algorithms.",
    badge: "Live Monitor Active",
    badgeColor: "text-primary bg-primary/10",
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
    title: "File & Attachment Sandboxing",
    desc: "Executes suspicious files in an isolated virtual environment to observe behavior before allowing access.",
    badge: "Isolated • Secure",
    badgeColor: "text-secondary bg-secondary/10",
  },
  {
    icon: Server,
    title: "Domain Intelligence",
    desc: "Correlates WHOIS, DNS, registrar history, and blacklist data to surface high-risk infrastructure instantly.",
    badge: "DNS + Reputation",
    badgeColor: "text-info bg-info/10",
  },
  {
    icon: Eye,
    title: "Visual Website Impersonation Detection",
    desc: "Compares screenshots against trusted brand baselines to detect cloned login pages and fake visual identity.",
    badge: "Similarity Engine",
    badgeColor: "text-warning bg-warning/10",
  },
  {
    icon: Shield,
    title: "Enterprise Threat Monitoring",
    desc: "Centralized SOC-grade dashboards with incident timelines, role-based access, and response visibility across teams.",
    badge: "SOC Ready",
    badgeColor: "text-danger bg-danger/10",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Intelligent Defense Layer</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 max-w-2xl mx-auto">
          Six pillars of modern cybersecurity in one platform.
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">Comprehensive threat analysis from URL scanning to visual impersonation detection.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 group flex flex-col"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <f.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-base mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{f.desc}</p>
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
  <section id="stats" className="py-14 border-y border-border/40">
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
  <section id="cta" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-primary/20 overflow-hidden"
      >
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190_85%_48%/0.06)] via-[hsl(225_65%_42%/0.03)] to-[hsl(260_70%_55%/0.06)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[hsl(190_85%_48%/0.05)] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] bg-[hsl(260_70%_55%/0.04)] rounded-full blur-[80px]" />

        <div className="relative p-12 md:p-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to fortify your business?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of companies using Phishing Detect & Protect to safeguard their most valuable digital assets.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-brand text-white font-bold text-lg neon-glow hover:scale-[1.03] transition-all duration-300"
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
        <img src={logo} alt="Phishing Detect & Protect" className="w-7 h-7 object-contain" />
        <span className="font-bold text-sm">Phishing D&P</span>
      </div>
      <div className="flex gap-6 text-xs text-muted-foreground">
        <button onClick={() => toast.info("Privacy Policy page coming soon.")} className="hover:text-foreground transition-colors">Privacy Policy</button>
        <button onClick={() => toast.info("Terms of Service page coming soon.")} className="hover:text-foreground transition-colors">Terms of Service</button>
        <button onClick={() => toast.info("Security page coming soon.")} className="hover:text-foreground transition-colors">Security</button>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 Phishing Detect & Protect. All rights reserved.</p>
    </div>
  </footer>
);

/* ===== PAGE ===== */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <RoleCards />
      <StatsBar />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
