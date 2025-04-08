
import { MainLayout } from "@/components/Layout/MainLayout";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TestsChart } from "@/components/Dashboard/TestsChart";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { dashboardStats, testCases, testExecutions, testTrends } from "@/data/mockData";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { selectedProjectId } = useSelectedProject();
  const navigate = useNavigate();

  // Filter test cases by the selected project
  const filteredTestCases = testCases.filter(tc => tc.project_id === selectedProjectId);
  
  // For this example, we'll just show placeholder content if mock data doesn't have matching project
  const hasTestCases = filteredTestCases.length > 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardStats stats={dashboardStats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestsChart data={testTrends} />
        </div>

        {hasTestCases ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestCaseList testCases={filteredTestCases.slice(0, 3)} />
            <ExecutionTable executions={testExecutions} />
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-medium">No test cases found for this project</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Get started by creating your first test case for this project.
            </p>
            <Button onClick={() => navigate('/test-cases/new')}>
              Create Test Case <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
