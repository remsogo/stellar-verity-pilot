
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import Defects from "@/pages/Defects";
import DefectForm from "@/pages/DefectForm";
import DefectDetails from "@/pages/DefectDetails";

export const DefectRoutes = () => {
  return (
    <>
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
    </>
  );
};
