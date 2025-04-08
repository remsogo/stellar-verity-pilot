
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthRoutes } from "./routes/AuthRoutes";
import { TestCaseRoutes } from "./routes/TestCaseRoutes";
import { TestExecutionRoutes } from "./routes/TestExecutionRoutes";
import { TestPlanRoutes } from "./routes/TestPlanRoutes";
import { DefectRoutes } from "./routes/DefectRoutes";
import { ProjectRoutes } from "./routes/ProjectRoutes";
import { AppRoutes } from "./routes/AppRoutes";

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
              <AuthRoutes />
              <TestCaseRoutes />
              <TestExecutionRoutes />
              <TestPlanRoutes />
              <DefectRoutes />
              <ProjectRoutes />
              <AppRoutes />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
