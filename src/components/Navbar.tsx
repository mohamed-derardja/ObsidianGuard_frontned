import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Phishing Detect & Protect" className="w-9 h-9 object-contain" />
          <span className="text-lg font-bold tracking-tight">
            Phishing <span className="text-gradient">D&P</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className={`transition-colors ${isHome ? "text-foreground" : "hover:text-foreground"}`}>Home</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#roles" className="hover:text-foreground transition-colors">Roles</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary/40 transition-all mr-1"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-brand text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
          >
            Register
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-card/95 backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col gap-3 text-sm">
              <Link to="/" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/dashboard" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <div className="flex gap-2 mt-2">
                <Link to="/dashboard" className="flex-1 text-center py-2.5 rounded-lg border border-border font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/dashboard" className="flex-1 text-center py-2.5 rounded-lg bg-gradient-brand text-primary-foreground font-semibold" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
