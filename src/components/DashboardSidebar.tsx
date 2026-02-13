import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Link, useLocation } from "react-router-dom";

import {

  LayoutDashboard, Zap, Mail, Globe, FileSearch, Settings,

  ChevronLeft, ChevronRight, X

} from "lucide-react";

import logo from "@/assets/logo_obsidian_root.svg";



const navItems = [

  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },

  { icon: Mail, label: "Email Analyzer", path: "/dashboard/email" },

  { icon: Globe, label: "URL & Domain", path: "/dashboard/url" },

  { icon: FileSearch, label: "File Scanner", path: "/dashboard/files" },

  { icon: Settings, label: "Settings", path: "/dashboard/settings" },

];



interface DashboardSidebarProps {

  mobileOpen?: boolean;

  onMobileClose?: () => void;

}



const DashboardSidebar = ({ mobileOpen = false, onMobileClose }: DashboardSidebarProps) => {

  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();



  const sidebarContent = (isMobile: boolean) => (

    <>

      <div className="h-14 flex items-center justify-between gap-2 px-4 border-b border-border">

        <div className="flex items-center gap-2">

          <img src={logo} alt="Obsidian Guard" className="w-10 h-10 object-contain flex-shrink-0" />

          {(isMobile || !collapsed) && <span className="font-bold text-sm">Obsidian <span className="text-gradient">Guard</span></span>}

        </div>

        {isMobile && (

          <button

            onClick={onMobileClose}

            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"

            aria-label="Close navigation"

          >

            <X className="w-5 h-5" />

          </button>

        )}

      </div>



      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto" aria-label="Dashboard navigation">

        {navItems.map((item) => {

          const active = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard");

          return (

            <Link

              key={item.label}

              to={item.path}

              onClick={isMobile ? onMobileClose : undefined}

              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${

                active

                  ? "bg-primary/10 text-primary font-medium border border-primary/10"

                  : "text-muted-foreground hover:bg-muted hover:text-foreground"

              }`}

              aria-current={active ? "page" : undefined}

            >

              <item.icon className="w-4 h-4 flex-shrink-0" />

              {(isMobile || !collapsed) && <span>{item.label}</span>}

            </Link>

          );

        })}

      </nav>



      {!isMobile && (

        <button

          onClick={() => setCollapsed(!collapsed)}

          className="m-3 p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center"

          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}

        >

          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}

        </button>

      )}

    </>

  );



  return (

    <>

      {/* Desktop sidebar */}

      <motion.aside

        animate={{ width: collapsed ? 72 : 240 }}

        transition={{ duration: 0.2 }}

        className="hidden md:flex flex-col h-screen sticky top-0 bg-[hsl(var(--sidebar-background))] border-r border-border"

        role="navigation"

      >

        {sidebarContent(false)}

      </motion.aside>



      {/* Mobile sidebar overlay */}

      <AnimatePresence>

        {mobileOpen && (

          <>

            <motion.div

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"

              onClick={onMobileClose}

            />

            <motion.aside

              initial={{ x: -280 }}

              animate={{ x: 0 }}

              exit={{ x: -280 }}

              transition={{ type: "spring", damping: 25, stiffness: 300 }}

              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-border md:hidden"

              role="navigation"

            >

              {sidebarContent(true)}

            </motion.aside>

          </>

        )}

      </AnimatePresence>

    </>

  );

};



export default DashboardSidebar;

