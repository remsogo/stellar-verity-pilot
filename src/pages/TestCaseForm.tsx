
import { MainLayout } from "@/components/Layout/MainLayout";
import { useParams } from "react-router-dom";
import { TestCaseForm as TestCaseFormComponent } from "@/components/TestCases/TestCaseForm";

const TestCaseFormPage = () => {
  const { id } = useParams<{ id: string }>();

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
