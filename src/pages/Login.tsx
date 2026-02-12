import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Eye, EyeOff, Shield, Mail, Lock, ArrowRight
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
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
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190_85%_48%/0.04)] via-transparent to-[hsl(260_70%_55%/0.03)]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-12">
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
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-10">
            <img src={logo} alt="Phishing Detect & Protect" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold">Phishing <span className="text-gradient">D&P</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.4)] space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-black/40 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-black/40 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              className="w-full h-12 rounded-lg bg-white text-gray-900 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
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
