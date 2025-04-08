
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import TestPlans from "@/pages/TestPlans";
import TestPlanForm from "@/pages/TestPlanForm";
import TestPlanDetails from "@/pages/TestPlanDetails";

export const TestPlanRoutes = () => {
  return (
    <>
      <Route 
        path="/test-plans" 
        element={
          <ProtectedRoute>
            <TestPlans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/test-plans/new" 
        element={
          <ProtectedRoute>
            <TestPlanForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/test-plans/:id" 
        element={
          <ProtectedRoute>
            <TestPlanDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/test-plans/:id/edit" 
        element={
          <ProtectedRoute>
            <TestPlanForm />
          </ProtectedRoute>
        } 
      />
    </>
  );
};
