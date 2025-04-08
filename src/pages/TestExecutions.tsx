import { MainLayout } from "@/components/Layout/MainLayout";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { testExecutions } from "@/data/mockData";

const TestExecutions = () => {
  return (
    <MainLayout 
      pageTitle="Test Executions" 
      pageDescription="View and manage your test execution history."
    >
      <ExecutionTable executions={testExecutions} />
    </MainLayout>
  );
};

export default TestExecutions;
