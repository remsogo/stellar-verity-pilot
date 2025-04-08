
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import TestCases from "@/pages/TestCases";
import TestCaseForm from "@/pages/TestCaseForm";
import TestExecution from "@/pages/TestExecution";

export const TestCaseRoutes = () => {
  return (
    <>
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
    </>
  );
};
