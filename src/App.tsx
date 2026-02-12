import { lazy, Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";



const Index = lazy(() => import("./pages/Index"));

const Login = lazy(() => import("./pages/Login"));

const Register = lazy(() => import("./pages/Register"));

const Dashboard = lazy(() => import("./pages/Dashboard"));

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const EnterpriseDashboard = lazy(() => import("./pages/EnterpriseDashboard"));

const NotFound = lazy(() => import("./pages/NotFound"));



const queryClient = new QueryClient();



const PageLoader = () => (

  <div className="flex min-h-screen items-center justify-center bg-background">

    <div className="flex flex-col items-center gap-3">

      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />

      <p className="text-sm text-muted-foreground">Loading...</p>

    </div>

  </div>

);



const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <BrowserRouter>

        <Suspense fallback={<PageLoader />}>

          <Routes>

            <Route path="/" element={<Index />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/dashboard/*" element={<Dashboard />} />

            <Route path="/enterprise" element={<EnterpriseDashboard />} />

            <Route path="/enterprise/*" element={<EnterpriseDashboard />} />

            <Route path="*" element={<NotFound />} />

          </Routes>

        </Suspense>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);



export default App;

