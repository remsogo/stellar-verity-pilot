
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import Projects from "@/pages/Projects";
import ProjectForm from "@/pages/ProjectForm";
import ProjectDetails from "@/pages/ProjectDetails";

export const ProjectRoutes = () => {
  return (
    <>
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
    </>
  );
};
