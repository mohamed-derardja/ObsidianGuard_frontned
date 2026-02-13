import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import emailService from "@/services/email.service";
import authService from "@/services/auth.service";
import {
  Mail, Shield, Key, CheckCircle, Eye, EyeOff, Lock, RefreshCw,
} from "lucide-react";

const ProfileSettings = () => {
  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Gmail state
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [checkingGmail, setCheckingGmail] = useState(true);

  useEffect(() => {
    checkGmailStatus();
  }, []);

  const checkGmailStatus = async () => {
    setCheckingGmail(true);
    try {
      const status = await emailService.getGmailStatus();
      setGmailConnected(status.connected);
    } catch {
      setGmailConnected(false);
    } finally {
      setCheckingGmail(false);
    }
  };

  const handleGmailConnect = async () => {
    setGmailLoading(true);
    try {
      const authUrl = await emailService.getGmailAuthUrl();
      if (authUrl && authUrl.startsWith("http")) {
        window.location.href = authUrl;
      } else {
        toast.error("Invalid Gmail authorization URL");
      }
    } catch (error) {
      toast.error("Failed to connect Gmail", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setGmailLoading(false);
    }
  };

  const handleGmailDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Gmail?")) return;
    setGmailLoading(true);
    try {
      await emailService.disconnectGmail();
      setGmailConnected(false);
      toast.success("Gmail disconnected successfully");
    } catch (error) {
      toast.error("Failed to disconnect Gmail", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setGmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-danger", width: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-warning", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-primary", width: "75%" };
    return { label: "Strong", color: "bg-success", width: "100%" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your password and integrations</p>
      </div>

      {/* ── Change Password ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-5"
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Change Password
        </h3>

        {/* Current password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Current Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full h-10 pl-9 pr-10 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full h-10 pl-9 pr-10 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength meter */}
          {newPassword && (
            <div className="space-y-1 pt-1">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className={`text-[10px] font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-10 pl-9 pr-10 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-[10px] text-danger">Passwords do not match</p>
          )}
        </div>

        <button
          onClick={handleChangePassword}
          disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {changingPassword ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Changing...
            </>
          ) : (
            <>
              <Key className="w-4 h-4" /> Change Password
            </>
          )}
        </button>
      </motion.div>

      {/* ── Gmail Integration ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Gmail Integration
        </h3>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${gmailConnected ? "bg-green-500/10" : "bg-primary/10"}`}>
              {gmailConnected ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Mail className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Gmail Account</p>
              {checkingGmail ? (
                <p className="text-xs text-muted-foreground">Checking connection...</p>
              ) : gmailConnected ? (
                <p className="text-xs text-green-500 font-medium">Connected — Emails sync automatically</p>
              ) : (
                <p className="text-xs text-muted-foreground">Connect your Gmail to sync and analyze emails</p>
              )}
            </div>
          </div>
          <button
            onClick={gmailConnected ? handleGmailDisconnect : handleGmailConnect}
            disabled={gmailLoading || checkingGmail}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all disabled:opacity-60 ${
              gmailConnected
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {gmailLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {gmailConnected ? "Disconnecting..." : "Connecting..."}
              </div>
            ) : gmailConnected ? (
              "Disconnect"
            ) : (
              "Connect Gmail"
            )}
          </button>
        </div>

        {gmailConnected && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Gmail is connected</p>
            <p className="text-xs text-muted-foreground">
              Your Gmail account is securely connected. Sync emails and run phishing analysis in the Email Analyzer tab.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
