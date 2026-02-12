import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/10 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Phish<span className="text-primary neon-text">Sleuth</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#footer" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_25px_hsl(183_100%_50%/0.4)] transition-all duration-300"
          >
            Register / Login
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
              <Link
                to="/dashboard"
                className="mt-2 text-center py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Register / Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
