
import { MainLayout } from "@/components/Layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, XCircle } from "lucide-react";
import { useTestExecution } from "@/hooks/use-test-execution";
import { Status, TestCase } from "@/types";
import { ExecutionHeader } from "@/components/Execution/ExecutionHeader";
import { ExecutionNotes } from "@/components/Execution/ExecutionNotes";
import { ExecutionControls } from "@/components/Execution/ExecutionControls";
import { TestExecutionStep } from "@/components/Execution/TestExecutionStep";

const TestExecution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    testCase,
    currentStepIndex,
    stepResults,
    notes,
    isSaving,
    isCompleted,
    isTestCaseLoading,
    isExecutionLoading,
    handleStepResult,
    handleNextStep,
    handlePreviousStep,
    handleNotesChange,
    handleSave,
    handleComplete,
    initiateExecution
  } = useTestExecution(id);

  useEffect(() => {
    initiateExecution();
  }, [id]);

  const handleCompleteAndNavigate = async () => {
    const success = await handleComplete();
    if (success) {
      navigate("/test-executions");
    }
  };

  if (isTestCaseLoading || isExecutionLoading) {
    return (
      <MainLayout 
        pageTitle="Execute Test" 
        pageDescription="Running test case..."
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!testCase) {
    return (
      <MainLayout 
        pageTitle="Test Case Not Found" 
        pageDescription="The requested test case could not be found."
      >
        <Card>
          <div className="text-center p-6">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Test Case Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested test case could not be found.</p>
            <button onClick={() => navigate("/test-cases")} className="bg-primary text-white px-4 py-2 rounded">
              Back to Test Cases
            </button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  // Create a mock execution for the ExecutionHeader component
  const mockExecution = {
    id: id || 'temp-id',
    testCaseId: testCase.id,
    testCase: testCase as TestCase,
    executor: 'Current User',
    status: 'pending' as Status,
    startTime: new Date().toISOString(),
    environment: 'Test',
    notes: notes,
    defects: []
  };

  return (
    <MainLayout 
      pageTitle="Execute Test" 
      pageDescription="Run through your test case steps and record results."
    >
      <div className="space-y-4">
        <Card className="card-futuristic">
          <ExecutionHeader execution={mockExecution} />
          
          <div className="p-6 pt-0">
            {testCase.steps && testCase.steps[currentStepIndex] && (
              <TestExecutionStep
                step={testCase.steps[currentStepIndex]}
                stepNumber={currentStepIndex + 1}
                totalSteps={testCase.steps?.length || 0}
                onStepResult={handleStepResult}
                result={stepResults[currentStepIndex]}
              />
            )}
          </div>
          
          <div className="flex items-center p-6 pt-0 justify-between">
            <button
              className="bg-secondary text-white px-4 py-2 rounded"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
            >
              Previous
            </button>
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={handleNextStep}
              disabled={testCase.steps && currentStepIndex === testCase.steps.length - 1}
            >
              {isCompleted ? "Complete" : "Next"}
            </button>
          </div>
        </Card>

        <ExecutionNotes notes={notes} onChange={handleNotesChange} />

        <ExecutionControls 
          isSaving={isSaving}
          isCompleted={isCompleted}
          onSave={handleSave}
          onComplete={handleCompleteAndNavigate}
        />
      </div>
    </MainLayout>
  );
};

export default TestExecution;
