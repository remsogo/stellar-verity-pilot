
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Parameters from "@/pages/Parameters";

export const AppRoutes = () => {
  return (
    <>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
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
    </>
  );
};
