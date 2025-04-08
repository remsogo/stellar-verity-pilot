
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import TestExecutions from "@/pages/TestExecutions";
import TestExecutionDetails from "@/pages/TestExecutionDetails";

export const TestExecutionRoutes = () => {
  return (
    <>
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
    </>
  );
};
