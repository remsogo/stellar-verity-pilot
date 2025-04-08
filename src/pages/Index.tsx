
import { MainLayout } from "@/components/Layout/MainLayout";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TestsChart } from "@/components/Dashboard/TestsChart";
import { TestCaseList } from "@/components/TestCases/TestCaseList";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTestCasesByProject } from "@/lib/api/testCases";
import { getTestExecutions } from "@/lib/api/testExecutions";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const Index = () => {
  const { selectedProjectId } = useSelectedProject();
  const navigate = useNavigate();

  // Fetch test cases for the selected project
  const { 
    data: testCases, 
    isLoading: isTestCasesLoading 
  } = useQuery({
    queryKey: ['testCases', selectedProjectId],
    queryFn: () => selectedProjectId ? getTestCasesByProject(selectedProjectId) : Promise.resolve([]),
    enabled: !!selectedProjectId
  });
  
  // Fetch test executions for the selected project
  const { 
    data: testExecutions, 
    isLoading: isExecutionsLoading 
  } = useQuery({
    queryKey: ['testExecutions', selectedProjectId],
    queryFn: () => selectedProjectId ? getTestExecutions(selectedProjectId) : Promise.resolve([]),
    enabled: !!selectedProjectId
  });

  // Fetch dashboard stats
  const { 
    stats, 
    trends, 
    isLoading: isStatsLoading 
  } = useDashboardStats(selectedProjectId);

  const isLoading = isTestCasesLoading || isExecutionsLoading || isStatsLoading;
  const hasTestCases = (testCases && testCases.length > 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full col-span-2 rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestsChart data={trends} />
            </div>

            {hasTestCases ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TestCaseList testCases={testCases.slice(0, 3)} />
                <div className="md:col-span-2">
                  <ExecutionTable executions={testExecutions?.slice(0, 5) || []} />
                </div>
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
