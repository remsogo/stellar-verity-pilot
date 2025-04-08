
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useNavigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selectedProjectId, isLoading: isProjectLoading, clearSelectedProject } = useSelectedProject();
  const navigate = useNavigate();
  const location = useLocation();

  // Exempt paths that don't require project selection
  const exemptPaths = [
    '/projects', 
    '/projects/new', 
    '/auth'
  ];
  
  const isExemptPath = exemptPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If on projects page but getting stuck, clear the selected project
  if (location.pathname === '/projects' && isProjectLoading) {
    clearSelectedProject();
    return <div className="flex items-center justify-center h-screen">Loading projects...</div>;
  }

  // Only check for selectedProjectId when on non-exempt paths and not loading project data
  if (!isExemptPath && !selectedProjectId && !isProjectLoading) {
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
};
