import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye, EyeOff, Shield, Mail, Lock, ArrowRight, ArrowLeft
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const storedType = localStorage.getItem("accountType");
      const isEnterprise = storedType === "enterprise";
      toast.success("Signed in successfully", { description: `Redirecting to ${isEnterprise ? "enterprise " : ""}dashboard...` });
      navigate(isEnterprise ? "/enterprise" : "/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(hsl(190 85% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 85% 48%) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(190_85%_48%/0.03)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(260_70%_55%/0.02)] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Left panel — branding (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-start justify-center pt-10 p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190_85%_48%/0.04)] via-transparent to-[hsl(260_70%_55%/0.03)]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <Link to="/" className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Phishing Detect & Protect" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">Phishing <span className="text-gradient">D&P</span></span>
          </Link>

          <h2 className="text-3xl font-bold mb-4">
            Protect your digital assets from <span className="text-gradient">cyber threats</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Advanced AI-powered phishing detection and real-time threat monitoring to keep your organization safe.
          </p>

          <div className="space-y-3">
            {[
              { icon: Shield, text: "Real-time threat detection" },
              { icon: Mail, text: "Email phishing analysis" },
              { icon: Lock, text: "Enterprise-grade security" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Right panel — login form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
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
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-5" noValidate>
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@email.com"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${errors.email ? "border-danger" : "border-primary/10"}`}
                />
              </div>
              {errors.email && <p id="email-error" className="text-xs text-danger ml-1" role="alert">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full h-11 pl-10 pr-11 rounded-lg bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${errors.password ? "border-danger" : "border-primary/10"}`}
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
              {errors.password && <p id="password-error" className="text-xs text-danger ml-1" role="alert">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-primary/40 accent-primary"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
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

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
