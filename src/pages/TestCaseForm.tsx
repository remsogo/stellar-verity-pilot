
import { MainLayout } from "@/components/Layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { TestCaseForm as TestCaseFormComponent } from "@/components/TestCases/TestCaseForm";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useEffect } from "react";

const TestCaseFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedProjectId } = useSelectedProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extra check to redirect if no project is selected
    if (!selectedProjectId) {
      navigate('/projects');
    }
  }, [selectedProjectId, navigate]);

  return (
    <MainLayout 
      pageTitle={id ? "Edit Test Case" : "Create Test Case"} 
      pageDescription={id ? "Update an existing test case." : "Create a new test case for your project."}
    >
      <TestCaseFormComponent id={id} />
    </MainLayout>
  );
};

export default TestCaseFormPage;
