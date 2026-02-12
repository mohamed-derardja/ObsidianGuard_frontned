import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-danger" />
        </div>
        <h1 className="text-6xl font-extrabold font-mono text-gradient mb-3">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-2">
          The page <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{location.pathname}</code> doesn't exist or has been moved.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          If you think this is an error, please contact support.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
