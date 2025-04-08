
import { MainLayout } from "@/components/Layout/MainLayout";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TestsChart } from "@/components/Dashboard/TestsChart";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { dashboardStats, testCases, testExecutions, testTrends } from "@/data/mockData";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardStats stats={dashboardStats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestsChart data={testTrends} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestCaseList testCases={testCases.slice(0, 3)} />
          <ExecutionTable executions={testExecutions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
