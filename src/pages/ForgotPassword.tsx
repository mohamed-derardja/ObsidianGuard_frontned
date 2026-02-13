import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      toast.success("Reset link sent!", { description: `Check your inbox at ${email}` });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-6">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(hsl(190 85% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 85% 48%) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(190_85%_48%/0.03)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(260_70%_55%/0.02)] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-6">
            <img src={logo} alt="Obsidian Guard" className="w-12 h-12 object-contain" />
            <span className="text-lg font-bold">Obsidian <span className="text-gradient">Guard</span></span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-muted-foreground text-sm">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-5" noValidate>
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
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@email.com"
                  required
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                  className={`w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${error ? "border-danger" : "border-primary/10"}`}
                />
              </div>
              {error && <p id="email-error" className="text-xs text-danger ml-1" role="alert">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  toast.info("You can try again with the same or a different email.");
                }}
                className="text-primary hover:underline font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
