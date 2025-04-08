
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Loader2, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { TestCase, Status } from "@/types";
import { TestExecutionStep } from "@/components/Execution/TestExecutionStep";
import { useUser } from "@/hooks/use-user";
import { getTestCase } from "@/lib/api/testCases";
import { createTestExecution, getTestExecution, updateTestExecution } from "@/lib/api/testExecutions";

// Create smaller components to reduce the main file size
import { ExecutionHeader } from "@/components/Execution/ExecutionHeader";
import { ExecutionNotes } from "@/components/Execution/ExecutionNotes";
import { ExecutionControls } from "@/components/Execution/ExecutionControls";

const TestExecution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch test case data
  const { data: testCaseData, isLoading: isTestCaseLoading } = useQuery({
    queryKey: ["testCase", id],
    queryFn: async () => {
      if (!id) throw new Error("No test case ID provided");
      return await getTestCase(id);
    },
    enabled: !!id
  });

  // Fetch existing execution data
  const { data: executionData, isLoading: isExecutionLoading } = useQuery({
    queryKey: ["testExecution", id],
    queryFn: async () => {
      if (!id) throw new Error("No test case ID provided");
      return await getTestExecution(id);
    },
    enabled: !!id
  });

  useEffect(() => {
    if (testCaseData) {
      setTestCase(testCaseData);
    }
    if (executionData) {
      // Initialize any existing execution data
      setStepResults(executionData.notes?.split(',').map(r => r === 'true') || []);
      setNotes(executionData.notes || "");
      setCurrentStepIndex(executionData.notes?.split(',').length || 0);
    }
  }, [testCaseData, executionData]);

  const createExecutionMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error("Missing required data");
      return await createTestExecution({
        test_case_id: id,
        user_id: user.id
      });
    },
    onSuccess: () => {
      toast({
        title: "Test execution created",
        description: "The test execution has been created successfully."
      });
    }
  });

  const updateExecutionMutation = useMutation({
    mutationFn: async ({ status, completed }: { status?: Status, completed?: boolean }) => {
      if (!executionData?.id) throw new Error("No execution ID");
      
      const params: any = { 
        id: executionData.id,
        notes 
      };
      
      if (completed) {
        params.end_time = new Date().toISOString();
        params.status = stepResults.every(r => r) ? "passed" : "failed";
      } else if (status) {
        params.status = status;
      }
      
      return await updateTestExecution(params);
    }
  });

  useEffect(() => {
    // Create an execution if none exists and we have the user data
    if (id && !executionData && !createExecutionMutation.isPending && user?.id) {
      createExecutionMutation.mutate();
    }
  }, [id, executionData, user, createExecutionMutation.isPending]);

  const handleStepResult = (result: boolean) => {
    const newStepResults = [...stepResults];
    newStepResults[currentStepIndex] = result;
    setStepResults(newStepResults);
  };

  const handleNextStep = () => {
    if (testCase?.steps && currentStepIndex < testCase.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateExecutionMutation.mutateAsync({});
      toast({
        title: "Test execution saved",
        description: "Your progress has been saved."
      });
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await updateExecutionMutation.mutateAsync({ completed: true });
      navigate("/test-executions");
    } catch (error: any) {
      toast({
        title: "Error completing test",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Test Case Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested test case could not be found.</p>
              <Button onClick={() => navigate("/test-cases")}>
                Back to Test Cases
              </Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const currentStep = testCase.steps?.[currentStepIndex];

  return (
    <MainLayout 
      pageTitle="Execute Test" 
      pageDescription="Run through your test case steps and record results."
    >
      <div className="space-y-4">
        <Card className="card-futuristic">
          <ExecutionHeader testCase={testCase} />
          
          <CardContent>
            {currentStep && (
              <TestExecutionStep
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                totalSteps={testCase.steps?.length || 0}
                onStepResult={handleStepResult}
                result={stepResults[currentStepIndex]}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={testCase.steps && currentStepIndex === testCase.steps.length - 1}
            >
              {isCompleted ? "Complete" : "Next"}
            </Button>
          </CardFooter>
        </Card>

        <ExecutionNotes notes={notes} onChange={handleNotesChange} />

        <ExecutionControls 
          isSaving={isSaving}
          isCompleted={isCompleted}
          onSave={handleSave}
          onComplete={handleComplete}
        />
      </div>
    </MainLayout>
  );
};

export default TestExecution;
