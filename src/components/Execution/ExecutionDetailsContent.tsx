
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { TestExecution, ExecutionStep } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertTriangle, Check, Clock } from 'lucide-react';
import { TestCaseInfoCard } from './TestCaseInfoCard';
import { ExecutionStepCard } from './ExecutionStepCard';
import { ExecutionSummaryCard } from './ExecutionSummaryCard';
import { ExecutionNotes } from './ExecutionNotes';
import { ExecutionHeader } from './ExecutionHeader';
import { CreateDefectFromExecution } from '@/components/Defects/CreateDefectFromExecution';
import { DefectsTable } from '@/components/Defects/DefectsTable';
import { useQuery } from '@tanstack/react-query';
import { getDefects } from '@/lib/api/defects';

interface ExecutionDetailsContentProps {
  execution: TestExecution;
  executionSteps: ExecutionStep[];
  navigate: NavigateFunction;
}

export const ExecutionDetailsContent: React.FC<ExecutionDetailsContentProps> = ({ 
  execution, 
  executionSteps,
  navigate
}) => {
  // Fetch defects linked to this execution
  const { data: allDefects, isLoading: isLoadingDefects } = useQuery({
    queryKey: ['defects'],
    queryFn: getDefects,
  });

  const linkedDefects = allDefects?.filter(defect => 
    defect.test_execution_id === execution.id
  ) || [];

  const renderStepCountByStatus = () => {
    const counts = {
      passed: executionSteps.filter(step => step.status === 'passed').length,
      failed: executionSteps.filter(step => step.status === 'failed').length,
      pending: executionSteps.filter(step => step.status === 'pending').length,
      blocked: executionSteps.filter(step => step.status === 'blocked').length,
    };

    return (
      <div className="flex gap-2 mt-2">
        <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Check size={12} /> {counts.passed} passed
        </div>
        <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertTriangle size={12} /> {counts.failed} failed
        </div>
        <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock size={12} /> {counts.pending} pending
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(-1)}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <CreateDefectFromExecution 
          testExecutionId={execution.id}
          testCaseTitle={execution.testCase.title}
          projectId={execution.testCase.project_id}
          onDefectCreated={() => {
            // Refetch defects after creating a new one
          }}
        />
      </div>

      <ExecutionHeader execution={execution} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex justify-between">
                <span>Test Steps {renderStepCountByStatus()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executionSteps.length > 0 ? (
                  executionSteps.map((step, index) => (
                    <ExecutionStepCard 
                      key={step.id} 
                      step={step} 
                    />
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>No test steps available for this execution.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <ExecutionNotes execution={execution} />
          
          {/* Linked Defects Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Linked Defects</CardTitle>
            </CardHeader>
            <CardContent>
              {linkedDefects.length > 0 ? (
                <DefectsTable 
                  defects={linkedDefects} 
                  isLoading={isLoadingDefects} 
                />
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <p className="mb-2">No defects linked to this execution.</p>
                  <p className="text-sm">
                    Click the "Report Defect" button above to create one.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TestCaseInfoCard testCase={execution.testCase} />
          <ExecutionSummaryCard execution={execution} />
        </div>
      </div>
    </div>
  );
};
