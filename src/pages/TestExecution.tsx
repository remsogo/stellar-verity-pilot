import { MainLayout } from "@/components/Layout/MainLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Check, Copy, Loader2, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTestCase, updateTestCase } from "@/lib/api/testCases";
import { createTestExecution, getTestExecution, updateTestExecution } from "@/lib/api/testExecutions";
import { TestExecutionStep } from "@/components/Execution/TestExecutionStep";
import { useUser } from "@/hooks/use-user";
import { Separator } from "@/components/ui/separator";

const TestExecution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [execution, setExecution] = useState<TestExecutionType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: testCaseData, isLoading: isTestCaseLoading } = useQuery({
    queryKey: ["testCase", id],
    queryFn: () => getTestCase(id!),
    enabled: !!id,
    onSuccess: (data) => {
      setTestCase(data);
    },
    onError: (error: any) => {
      toast({
        title: "Error fetching test case",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: executionData, isLoading: isExecutionLoading } = useQuery({
    queryKey: ["testExecution", id],
    queryFn: () => getTestExecution(id!),
    enabled: !!id,
    onSuccess: (data) => {
      setExecution(data);
      setStepResults(data.step_results || []);
      setNotes(data.notes || "");
      setIsCompleted(data.completed || false);
      setCurrentStepIndex(data.step_results?.length || 0);
    },
    onError: (error: any) => {
      toast({
        title: "Error fetching test execution",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (testCaseData) {
      setTestCase(testCaseData);
    }
    if (executionData) {
      setExecution(executionData);
      setStepResults(executionData.step_results || []);
      setNotes(executionData.notes || "");
      setIsCompleted(executionData.completed || false);
      setCurrentStepIndex(executionData.step_results?.length || 0);
    }
  }, [testCaseData, executionData]);

  const createExecutionMutation = useMutation({
    mutationFn: createTestExecution,
    onSuccess: (data) => {
      setExecution(data);
      toast({
        title: "Test execution created",
        description: "The test execution has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating test execution",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateExecutionMutation = useMutation({
    mutationFn: updateTestExecution,
    onSuccess: (data) => {
      setExecution(data);
      toast({
        title: "Test execution updated",
        description: "The test execution has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating test execution",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (id && !execution && !createExecutionMutation.isLoading) {
      createExecutionMutation.mutate({
        test_case_id: id,
        user_id: user?.id!,
        step_results: [],
        notes: "",
        completed: false,
      });
    }
  }, [id, execution, user, createExecutionMutation]);

  const handleStepResult = (result: boolean) => {
    const newStepResults = [...stepResults];
    newStepResults[currentStepIndex] = result;
    setStepResults(newStepResults);
  };

  const handleNextStep = () => {
    if (currentStepIndex < testCase!.steps.length - 1) {
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
      await updateExecutionMutation.mutateAsync({
        id: execution!.id,
        step_results: stepResults,
        notes: notes,
        completed: isCompleted,
      });
      toast({
        title: "Test execution saved",
        description: "The test execution has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving test execution",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await updateExecutionMutation.mutateAsync({
        id: execution!.id,
        step_results: stepResults,
        notes: notes,
        completed: true,
      });
      toast({
        title: "Test execution completed",
        description: "The test execution has been completed successfully.",
      });
      navigate("/test-executions");
    } catch (error: any) {
      toast({
        title: "Error completing test execution",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isTestCaseLoading || isExecutionLoading) {
    return <div>Loading...</div>;
  }

  if (!testCase || !execution) {
    return <div>Test case not found</div>;
  }

  const currentStep = testCase.steps[currentStepIndex];

  return (
    <MainLayout 
      pageTitle="Execute Test" 
      pageDescription="Run through your test case steps and record results."
    >
      <div className="space-y-4">
        <Card className="card-futuristic">
          <CardHeader>
            <h3 className="text-lg font-semibold">Test Case: {testCase.title}</h3>
            <p className="text-sm text-muted-foreground">Description: {testCase.description}</p>
          </CardHeader>
          <CardContent>
            {currentStep && (
              <TestExecutionStep
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                totalSteps={testCase.steps.length}
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
              disabled={currentStepIndex === testCase.steps.length - 1}
            >
              {isCompleted ? "Complete" : "Next"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-futuristic">
          <CardHeader>
            <h4 className="text-md font-semibold">Execution Notes</h4>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this execution..."
              value={notes}
              onChange={handleNotesChange}
              className="bg-background"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </Button>
          <Button onClick={handleComplete} disabled={isSaving || !isCompleted}>
            {isSaving ? (
              <>
                Completing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Complete Execution"
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestExecution;
