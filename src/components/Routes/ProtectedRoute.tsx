
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { toast } from "@/components/ui/use-toast";

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

  // Paths that require a selected project
  const projectRequiredPaths = [
    '/test-cases/new',
    '/test-cases/',
    '/test-execution/',
    '/defects/',
    '/parameters',
    '/test-plans',
    '/test-executions'
  ];

  const requiresProject = projectRequiredPaths.some(path => 
    location.pathname.startsWith(path) || location.pathname === '/'
  );

  // Add console logs to help debug
  useEffect(() => {
    console.log('ProtectedRoute rendered', { 
      isAuthenticated, 
      isLoading, 
      selectedProjectId, 
      isProjectLoading,
      path: location.pathname,
      isExemptPath,
      requiresProject
    });
  }, [isAuthenticated, isLoading, selectedProjectId, isProjectLoading, location.pathname, isExemptPath, requiresProject]);

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

  // Redirect to auth if not authenticated - always redirect for all routes
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location.pathname !== "/auth" ? location.pathname : "/projects" }} replace />;
  }

  // For authenticated users, if they're on the root path, redirect to projects
  if (location.pathname === "/") {
    console.log('Redirecting to projects page from root');
    return <Navigate to="/projects" replace />;
  }

  // Allow access to exempt paths without a selected project
  if (isExemptPath) {
    return <>{children}</>;
  }

  // Allow access while project data is still loading
  if (isProjectLoading) {
    return <div className="flex items-center justify-center h-screen">Loading project data...</div>;
  }

  // Redirect to projects page if no project is selected and we're on a path that requires a project
  if (!selectedProjectId && requiresProject) {
    console.log('Redirecting to projects page because no project is selected');
    toast({
      title: "No Project Selected",
      description: "Please select or create a project first.",
      variant: "destructive",
    });
    return <Navigate to="/projects" replace />;
  }

  // All checks passed, render the children
  return <>{children}</>;
};
