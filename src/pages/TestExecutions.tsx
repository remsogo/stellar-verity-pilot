
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/Layout/MainLayout";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { useQuery } from '@tanstack/react-query';
import { getTestExecutions } from '@/lib/api/testExecutions';
import { useSelectedProject } from '@/hooks/use-selected-project';
import { Skeleton } from '@/components/ui/skeleton';

const TestExecutions = () => {
  const { selectedProjectId } = useSelectedProject();
  
  const { data: executions, isLoading } = useQuery({
    queryKey: ['testExecutions', selectedProjectId],
    queryFn: () => selectedProjectId ? getTestExecutions(selectedProjectId) : Promise.resolve([]),
    enabled: !!selectedProjectId
  });

  return (
    <MainLayout 
      pageTitle="Test Executions" 
      pageDescription="View and manage your test execution history."
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <ExecutionTable executions={executions || []} />
      )}
    </MainLayout>
  );
};

export default TestExecutions;
