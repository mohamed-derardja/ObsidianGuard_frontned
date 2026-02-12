import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye, EyeOff, Shield, User, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle,
  Building2, Zap, Globe, FileSearch, BarChart3, Headphones, Users, Key
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

type AccountType = "user" | "enterprise";

/* ───── pricing / pack data ───── */
const userPack = {
  name: "User Pack",
  price: "Free",
  period: "",
  description: "Essential protection for individuals",
  features: [
    "50 email scans per day",
    "URL & link analysis",
    "Basic threat reports",
    "Browser extension access",
    "Community support",
  ],
  highlight: false,
};

const enterprisePack = {
  name: "Enterprise Pack",
  price: "$49",
  period: "/month",
  description: "Complete security for organizations",
  features: [
    "Unlimited email & URL scans",
    "Domain & attachment monitoring",
    "Advanced analytics dashboard",
    "API access & integrations",
    "Role-based access control & SSO",
    "Dedicated account manager",
    "Custom threat rules & policies",
    "Priority 24/7 support",
  ],
  highlight: true,
};

const Register = () => {
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  // Enterprise-only fields
  const [companyName, setCompanyName] = useState("");

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword },
  ];

  const navigate = useNavigate();

  const passwordStrength = passwordChecks.filter((c) => c.met).length;
  const strengthLabel = passwordStrength <= 1 ? "Weak" : passwordStrength <= 2 ? "Fair" : passwordStrength <= 3 ? "Good" : "Strong";
  const strengthColor = passwordStrength <= 1 ? "bg-danger" : passwordStrength <= 2 ? "bg-warning" : passwordStrength <= 3 ? "bg-info" : "bg-success";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (passwordStrength < 4) {
      toast.error("Please meet all password requirements before continuing.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("accountType", accountType);
      toast.success("Account created successfully!", { description: "Welcome to Phishing D&P." });
      navigate(accountType === "enterprise" ? "/enterprise" : "/dashboard");
    }, 1500);
  };

  const pack = accountType === "user" ? userPack : enterprisePack;

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(hsl(190 85% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 85% 48%) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[hsl(260_70%_55%/0.03)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[hsl(190_85%_48%/0.03)] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Left panel — pack details (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-start justify-center pt-10 p-12">
        <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(190_85%_48%/0.04)] via-transparent to-[hsl(260_70%_55%/0.03)]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <Link to="/" className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Phishing Detect & Protect" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">Phishing <span className="text-gradient">D&P</span></span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={accountType}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pack card */}
              <div className={`p-6 rounded-xl border ${pack.highlight ? "border-primary/30 bg-primary/[0.03]" : "border-border bg-card/40"} backdrop-blur-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                      {accountType === "user" ? "Personal" : "Business"}
                    </p>
                    <h3 className="text-xl font-bold">{pack.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gradient">{pack.price}</span>
                    {pack.period && <span className="text-sm text-muted-foreground">{pack.period}</span>}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-5">{pack.description}</p>

                <div className="space-y-2.5">
                  {pack.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { value: "2.4M+", label: "Threats Blocked" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "500+", label: "Companies" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card p-3 text-center">
                    <p className="text-lg font-bold text-gradient">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─── Right panel — register form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            {/* Logo + back arrow — visible on mobile only */}
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
              <Link to="/" className="flex items-center gap-2.5">
                <img src={logo} alt="Phishing Detect & Protect" className="w-9 h-9 object-contain" />
                <span className="text-lg font-bold">Phishing <span className="text-gradient">D&P</span></span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm">Select your plan and get started</p>
          </div>

          {/* ─── Account type toggle ─── */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { key: "user" as const, icon: User, label: "User", desc: "Free personal plan" },
              { key: "enterprise" as const, icon: Building2, label: "Enterprise", desc: "$49/mo per org" },
            ]).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setAccountType(opt.key)}
                className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                  accountType === opt.key
                    ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(56,189,248,0.06)]"
                    : "border-border bg-card/40 hover:border-border/80 hover:bg-card/60"
                }`}
              >
                {accountType === opt.key && (
                  <motion.div layoutId="register-type-check" className="absolute top-3 right-3">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
                <opt.icon className={`w-5 h-5 mb-2 ${accountType === opt.key ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-sm font-semibold ${accountType === opt.key ? "text-foreground" : "text-muted-foreground"}`}>{opt.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          {/* ─── Mobile pack summary ─── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-pack-${accountType}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mb-5 overflow-hidden"
            >
              <div className="p-4 rounded-xl border border-border bg-card/40 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{pack.name}</p>
                    <p className="text-xs text-muted-foreground">{pack.description}</p>
                  </div>
                  <p className="text-lg font-bold text-gradient flex-shrink-0 ml-3">{pack.price}<span className="text-xs text-muted-foreground">{pack.period}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-border/50">
                  {pack.features.slice(0, 4).map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
                {pack.features.length > 4 && (
                  <p className="text-[10px] text-primary/70 mt-2 ml-[18px]">+{pack.features.length - 4} more features</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-4" noValidate>
            {/* Company Name — enterprise only */}
            <AnimatePresence>
              {accountType === "enterprise" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground ml-1">
                    Company name
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                {accountType === "enterprise" ? "Work email" : "Email address"}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={accountType === "enterprise" ? "you@company.com" : "you@email.com"}
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-muted/30 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground ml-1">
                Confirm password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2.5"
              >
                {/* Visual strength bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 1 ? "text-danger" : passwordStrength <= 2 ? "text-warning" : passwordStrength <= 3 ? "text-info" : "text-success"}`}>{strengthLabel}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength >= step ? strengthColor : "bg-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle className={`w-3 h-3 flex-shrink-0 ${check.met ? "text-success" : "text-muted-foreground/40"}`} />
                      <span className={check.met ? "text-success" : "text-muted-foreground/60"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-border bg-muted/50 text-primary focus:ring-primary/40 accent-primary"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register as {accountType === "user" ? "User" : "Enterprise"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div>
            <button 
              type="button"
              className="w-full h-12 rounded-lg bg-card border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-3 hover:bg-muted transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
