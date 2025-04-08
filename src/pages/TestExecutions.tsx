
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/Layout/MainLayout";
import { ExecutionTable } from "@/components/Execution/ExecutionTable";
import { useQuery } from '@tanstack/react-query';
import { getTestExecutions } from '@/lib/api/testExecutions';
import { useSelectedProject } from '@/hooks/use-selected-project';
import { Skeleton } from '@/components/ui/skeleton';

const TestExecutions = () => {
  const { selectedProject } = useSelectedProject();
  
  const { data: executions, isLoading } = useQuery({
    queryKey: ['testExecutions', selectedProject?.id],
    queryFn: () => selectedProject ? getTestExecutions(selectedProject.id) : Promise.resolve([]),
    enabled: !!selectedProject
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
