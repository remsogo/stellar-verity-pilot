
import React from 'react';
import { MainLayout } from "@/components/Layout/MainLayout";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExecutionDetails } from '@/lib/api/testExecutions';
import { ExecutionDetailsContent } from '@/components/Execution/ExecutionDetailsContent';
import { ExecutionDetailsLoadingState } from '@/components/Execution/ExecutionDetailsLoadingState';
import { ExecutionDetailsNotFound } from '@/components/Execution/ExecutionDetailsNotFound';
import { ExecutionStep, TestExecution } from '@/types';
import { useToast } from '@/hooks/use-toast';

const TestExecutionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);

  const { data: execution, isLoading, error } = useQuery({
    queryKey: ['executionDetails', id],
    queryFn: async () => {
      if (!id) throw new Error('No execution ID provided');
      return await getExecutionDetails(id);
    },
    enabled: !!id,
    onError: (error: Error) => {
      toast({
        title: 'Error fetching execution details',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (id) {
      // This would be replaced with a real API call in a production app
      // In this case we're creating mock execution steps based on the test case steps
      if (execution?.testCase?.steps) {
        const mockSteps = execution.testCase.steps.map((step, index) => ({
          id: `step-${index}`,
          test_step_id: step.id,
          execution_id: execution.id,
          status: execution.status,
          actual_result: null,
          step_order: step.order,
          description: step.description,
          expected_result: step.expectedResult
        }));
        setExecutionSteps(mockSteps);
      }
    }
  }, [id, execution]);

  if (isLoading) {
    return (
      <MainLayout 
        pageTitle="Execution Details" 
        pageDescription="View detailed results of a test execution."
      >
        <ExecutionDetailsLoadingState />
      </MainLayout>
    );
  }

  if (error || !execution) {
    return (
      <MainLayout 
        pageTitle="Execution Not Found" 
        pageDescription="The requested test execution could not be found."
      >
        <ExecutionDetailsNotFound navigate={navigate} />
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      pageTitle={`Execution: ${execution.testCase.title}`}
      pageDescription="View detailed results of this test execution"
    >
      <ExecutionDetailsContent 
        execution={execution} 
        executionSteps={executionSteps} 
        navigate={navigate} 
      />
    </MainLayout>
  );
};

export default TestExecutionDetails;
