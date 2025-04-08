
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import TestCases from "./pages/TestCases";
import TestCaseForm from "./pages/TestCaseForm";
import TestExecution from "./pages/TestExecution";
import TestExecutions from "./pages/TestExecutions";
import TestExecutionDetails from "./pages/TestExecutionDetails";
import Defects from "./pages/Defects";
import DefectForm from "./pages/DefectForm";
import DefectDetails from "./pages/DefectDetails";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
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

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-cases" 
                element={
                  <ProtectedRoute>
                    <TestCases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-cases/new" 
                element={
                  <ProtectedRoute>
                    <TestCaseForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-cases/:id" 
                element={
                  <ProtectedRoute>
                    <TestCaseForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-execution/:id" 
                element={
                  <ProtectedRoute>
                    <TestExecution />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-executions" 
                element={
                  <ProtectedRoute>
                    <TestExecutions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-execution-details/:id" 
                element={
                  <ProtectedRoute>
                    <TestExecutionDetails />
                  </ProtectedRoute>
                } 
              />
              {/* Defect Management Routes */}
              <Route 
                path="/defects" 
                element={
                  <ProtectedRoute>
                    <Defects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/defects/new" 
                element={
                  <ProtectedRoute>
                    <DefectForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/defects/:id" 
                element={
                  <ProtectedRoute>
                    <DefectDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/defects/:id/edit" 
                element={
                  <ProtectedRoute>
                    <DefectForm />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
