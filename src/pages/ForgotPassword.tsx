import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo_obsidian_root.svg";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/auth.service";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Step = "email" | "code" | "password" | "success";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { forgotPassword, verifyResetCode, resetPassword } = useAuth();

  const passwordChecks = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "One number", met: /\d/.test(newPassword) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: "Passwords match", met: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  const passwordStrength = passwordChecks.filter((c) => c.met).length;

  const handleSendCode = async (e: React.FormEvent) => {
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
    try {
      await forgotPassword(email);
      setStep("code");
      toast.success("Reset code sent!", { description: `Check your inbox at ${email}` });
    } catch (err) {
      if (err instanceof ApiError) {
        // Still proceed even if user not found (security)
        setStep("code");
        toast.success("Reset code sent!", { description: `If an account exists, you'll receive a code.` });
      } else {
        toast.error("Failed to send reset code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await verifyResetCode(email, code);
      setStep("password");
      toast.success("Code verified!", { description: "Now set your new password" });
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Verification failed", { description: err.message });
      } else {
        toast.error("Invalid verification code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 5) {
      toast.error("Please meet all password requirements");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(newPassword);
      setStep("success");
      toast.success("Password reset successfully!");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Reset failed", { description: err.message });
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
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
            {step === "email" && "Enter the email address associated with your account."}
            {step === "code" && "Enter the 6-digit code we sent to your email."}
            {step === "password" && "Create a new strong password for your account."}
            {step === "success" && "Your password has been reset successfully."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Email */}
          {step === "email" && (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendCode}
              className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-5"
              noValidate
            >
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
                    className={`w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${error ? "border-danger" : "border-primary/10"}`}
                  />
                </div>
                {error && <p className="text-xs text-danger ml-1" role="alert">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Reset Code<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.form>
          )}

          {/* Step 2: Code Verification */}
          {step === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-5"
            >
              <div className="text-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Code sent to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify Code<ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Didn't receive the code?{" "}
                <button type="button" onClick={() => setStep("email")} className="text-primary hover:underline font-medium">
                  Try again
                </button>
              </p>
            </motion.div>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <motion.form
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetPassword}
              className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-foreground ml-1">
                  New password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-muted/30 border border-primary/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
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

              {newPassword.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle className={`w-3 h-3 flex-shrink-0 ${check.met ? "text-success" : "text-muted-foreground/40"}`} />
                      <span className={check.met ? "text-success" : "text-muted-foreground/60"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || passwordStrength < 5}
                className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.form>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-7 rounded-xl border border-border bg-card/60 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.15)] text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-lg font-semibold">Password Reset Complete</h2>
              <p className="text-sm text-muted-foreground">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full h-11 rounded-lg bg-gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all neon-glow"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
