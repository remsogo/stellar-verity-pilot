
import { Navbar } from "@/components/Navigation/Navbar";
import { Sidebar } from "@/components/ui/sidebar"; // Fixed import path to lowercase 'ui'
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TestsChart } from "@/components/Dashboard/TestsChart";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { dashboardStats, testCases, testExecutions, testTrends } from "@/data/mockData";

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your tests.
              </p>
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default Index;
