
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selectedProjectId, isLoading: isProjectLoading } = useSelectedProject();
  const location = useLocation();

  // Exempt paths that don't require project selection
  const exemptPaths = [
    '/projects', 
    '/projects/new', 
    '/auth'
  ];
  
  const isExemptPath = exemptPaths.some(path => location.pathname.startsWith(path));

  // Add console logs to help debug
  useEffect(() => {
    console.log('ProtectedRoute rendered', { 
      isAuthenticated, 
      isLoading, 
      selectedProjectId, 
      isProjectLoading,
      path: location.pathname,
      isExemptPath
    });
  }, [isAuthenticated, isLoading, selectedProjectId, isProjectLoading, location.pathname, isExemptPath]);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // FIXED: Only redirect to /projects if we're not already on an exempt path
  // AND we don't have a selected project AND we're done loading project data
  if (!isExemptPath && !selectedProjectId && !isProjectLoading) {
    console.log('Redirecting to projects page because no project is selected');
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
};
