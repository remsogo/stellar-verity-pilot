
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar"; 
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TestsChart } from "@/components/Dashboard/TestsChart";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { dashboardStats, testCases, testExecutions, testTrends } from "@/data/mockData";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <CustomSidebar />
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
    </SidebarProvider>
  );
};

export default Index;
