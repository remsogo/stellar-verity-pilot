
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Loader2, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { TestStep, TestCase } from "@/types";
import { TestExecutionStep } from "@/components/Execution/TestExecutionStep";
import { useUser } from "@/hooks/use-user";

interface TestExecution {
  id: string;
  test_case_id: string;
  executor: string;
  status: string;
  start_time: string;
  end_time?: string;
  environment: string;
  notes?: string;
  step_results?: boolean[];
  completed?: boolean;
}

const TestExecution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [execution, setExecution] = useState<TestExecution | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: testCaseData, isLoading: isTestCaseLoading } = useQuery({
    queryKey: ["testCase", id],
    queryFn: async () => {
      if (!id) throw new Error("No test case ID provided");
      
      const { data, error } = await supabase
        .from("test_cases")
        .select("*, steps:test_steps(*)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as TestCase;
    },
    enabled: !!id
  });

  const { data: executionData, isLoading: isExecutionLoading } = useQuery({
    queryKey: ["testExecution", id],
    queryFn: async () => {
      if (!id) throw new Error("No test case ID provided");
      
      // Try to find an existing execution for this test case that isn't completed
      const { data, error } = await supabase
        .from("test_executions")
        .select("*")
        .eq("test_case_id", id)
        .is("end_time", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as TestExecution | null;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (testCaseData) {
      setTestCase(testCaseData);
    }
    if (executionData) {
      setExecution(executionData);
      // Initialize step results if available
      const existingResults = executionData.step_results || [];
      setStepResults(existingResults);
      setNotes(executionData.notes || "");
      setIsCompleted(!!executionData.completed);
      setCurrentStepIndex(existingResults.length || 0);
    }
  }, [testCaseData, executionData]);

  const createExecutionMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error("Missing required data");
      
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("test_executions")
        .insert({
          test_case_id: id,
          executor: user.id,
          status: "pending",
          start_time: now,
          environment: "Development"
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as TestExecution;
    },
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
    }
  });

  const updateExecutionMutation = useMutation({
    mutationFn: async (data: { 
      id: string; 
      step_results: boolean[]; 
      notes: string; 
      completed: boolean; 
    }) => {
      const updateData: any = {
        notes: data.notes,
      };
      
      if (data.completed) {
        updateData.end_time = new Date().toISOString();
        updateData.status = data.step_results.every(result => result) ? "passed" : "failed";
      }
      
      const { data: updatedExecution, error } = await supabase
        .from("test_executions")
        .update(updateData)
        .eq("id", data.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedExecution;
    },
    onSuccess: (data) => {
      setExecution(data as TestExecution);
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
    }
  });

  useEffect(() => {
    if (id && !execution && !createExecutionMutation.isPending && user?.id) {
      createExecutionMutation.mutate();
    }
  }, [id, execution, user, createExecutionMutation.isPending]);

  const handleStepResult = (result: boolean) => {
    const newStepResults = [...stepResults];
    newStepResults[currentStepIndex] = result;
    setStepResults(newStepResults);
  };

  const handleNextStep = () => {
    if (testCase && currentStepIndex < testCase.steps!.length - 1) {
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
    if (!execution) return;
    
    setIsSaving(true);
    try {
      await updateExecutionMutation.mutateAsync({
        id: execution.id,
        step_results: stepResults,
        notes: notes,
        completed: isCompleted
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!execution) return;
    
    setIsSaving(true);
    try {
      await updateExecutionMutation.mutateAsync({
        id: execution.id,
        step_results: stepResults,
        notes: notes,
        completed: true
      });
      navigate("/test-executions");
    } catch (error: any) {
      console.error(error);
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

  const currentStep = testCase.steps && testCase.steps[currentStepIndex];

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
