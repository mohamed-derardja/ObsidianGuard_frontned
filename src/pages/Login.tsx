import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye, EyeOff, Shield, Mail, Lock, ArrowRight, ArrowLeft
} from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/auth.service";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google Sign-In callback
  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      // Default to USER role for login - if they're an existing enterprise user, backend will handle it
      await loginWithGoogle(credential, 'USER');
      const storedType = localStorage.getItem("accountType");
      const isEnterprise = storedType === "enterprise";
      toast.success("Signed in with Google", { description: `Redirecting to ${isEnterprise ? "enterprise " : ""}dashboard...` });
      navigate(isEnterprise ? "/enterprise" : "/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Google Sign-In failed", { description: error.message });
      } else {
        toast.error("Google Sign-In failed", { description: "An unexpected error occurred" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  const handleGoogleError = useCallback((error: Error) => {
    toast.error("Google Sign-In error", { description: error.message });
  }, []);

  const { buttonRef } = useGoogleAuth({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      const storedType = localStorage.getItem("accountType");
      const isEnterprise = storedType === "enterprise";
      toast.success("Signed in successfully", { description: `Redirecting to ${isEnterprise ? "enterprise " : ""}dashboard...` });
      navigate(isEnterprise ? "/enterprise" : "/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Login failed", { description: error.message });
      } else {
        toast.error("Login failed", { description: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
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
            <img src={logo} alt="Obsidian Guard" className="w-14 h-14 object-contain" />
            <span className="text-xl font-bold">Obsidian <span className="text-gradient">Guard</span></span>
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
                <img src={logo} alt="Obsidian Guard" className="w-12 h-12 object-contain" />
                <span className="text-lg font-bold">Obsidian <span className="text-gradient">Guard</span></span>
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
          <div className="relative">
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            <div 
              ref={buttonRef} 
              className="w-full flex items-center justify-center [&>div]:w-full [&_iframe]:!w-full"
            />
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
