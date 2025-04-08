
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

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to auth if not authenticated - IMMEDIATE REDIRECT
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Allow access to exempt paths without a selected project
  if (isExemptPath) {
    return <>{children}</>;
  }

  // Allow access while project data is still loading
  if (isProjectLoading) {
    return <>{children}</>;
  }

  // Redirect to projects page if no project is selected and we're on a protected path
  if (!selectedProjectId) {
    console.log('Redirecting to projects page because no project is selected');
    return <Navigate to="/projects" replace />;
  }

  // All checks passed, render the children
  return <>{children}</>;
};
