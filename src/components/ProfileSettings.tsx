import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User, Mail, Phone, Building2, MapPin, Globe, Camera, Save, Shield, Key, Bell
} from "lucide-react";

const ProfileSettings = () => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarName, setAvatarName] = useState<string | null>(null);
  const [twoFA, setTwoFA] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  const [profile, setProfile] = useState({
    email: "admin@phishingdp.com",
    phone: "+213 555 0123",
    company: "Obsidian Guard",
    role: "Security Analyst",
    location: "Algiers, Algeria",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { setAvatarName(e.target.files[0].name); toast.success(`Avatar updated: ${e.target.files[0].name}`); } }} />
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-bold text-primary-foreground">
              AU
            </div>
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
              aria-label="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Admin User</h3>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
            <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5"
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="text-xs font-medium text-muted-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                id="location"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="company" className="text-xs font-medium text-muted-foreground">Company</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                id="company"
                value={profile.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/30 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

        </div>
      </motion.div>

      {/* Security section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Security
        </h3>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
            </div>
          </div>
          <button
            onClick={() => toast.info("Password change will be available soon.")}
            className="text-xs text-primary font-medium hover:underline"
          >
            Change
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
          </div>
          <button
            onClick={() => { setTwoFA(!twoFA); toast.success(twoFA ? "2FA disabled." : "2FA enabled."); }}
            className={`relative w-10 h-5.5 rounded-full transition-colors ${twoFA ? "bg-success" : "bg-muted"}`}
            style={{ width: 40, height: 22 }}
            aria-label="Toggle two-factor authentication"
          >
            <span className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${twoFA ? "translate-x-[18px]" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive alerts for suspicious activity</p>
            </div>
          </div>
          <button
            onClick={() => { setEmailNotif(!emailNotif); toast.success(emailNotif ? "Notifications disabled." : "Notifications enabled."); }}
            className={`relative rounded-full transition-colors ${emailNotif ? "bg-success" : "bg-muted"}`}
            style={{ width: 40, height: 22 }}
            aria-label="Toggle email notifications"
          >
            <span className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${emailNotif ? "translate-x-[18px]" : "translate-x-0"}`} />
          </button>
        </div>
      </motion.div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 neon-glow"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
