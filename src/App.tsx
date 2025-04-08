
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";

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
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import ProjectDetails from "./pages/ProjectDetails";
import Parameters from "./pages/Parameters";

const queryClient = new QueryClient();

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
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/new" 
                element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id" 
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:id/edit" 
                element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/parameters" 
                element={
                  <ProtectedRoute>
                    <Parameters />
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
