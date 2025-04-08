
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getTestCase, 
  getTestExecution, 
  createTestExecution, 
  updateTestExecution 
} from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { TestCase, TestExecution } from '@/types';

export const useTestExecution = (testCaseId: string | undefined) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [execution, setExecution] = useState<TestExecution | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch test case data
  const { isLoading: isTestCaseLoading } = useQuery({
    queryKey: ["testCase", testCaseId],
    queryFn: async () => {
      if (!testCaseId) throw new Error("No test case ID provided");
      return await getTestCase(testCaseId);
    },
    enabled: !!testCaseId,
    onSuccess: (data) => {
      setTestCase(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error fetching test case",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Fetch existing execution data
  const { isLoading: isExecutionLoading } = useQuery({
    queryKey: ["testExecution", testCaseId],
    queryFn: async () => {
      if (!testCaseId) throw new Error("No test case ID provided");
      return await getTestExecution(testCaseId);
    },
    enabled: !!testCaseId,
    onSuccess: (data) => {
      if (data) {
        setExecution(data);
        setStepResults(data.notes?.split(',').map(r => r === 'true') || []);
        setNotes(data.notes || "");
        setCurrentStepIndex(data.notes?.split(',').length || 0);
      }
    }
  });

  const createExecutionMutation = useMutation({
    mutationFn: async () => {
      if (!testCaseId || !user?.id) throw new Error("Missing required data");
      return await createTestExecution({
        test_case_id: testCaseId,
        user_id: user.id
      });
    },
    onSuccess: (data) => {
      setExecution(data);
      toast({
        title: "Test execution created",
        description: "The test execution has been created successfully."
      });
    }
  });

  const updateExecutionMutation = useMutation({
    mutationFn: async ({ status, completed }: { status?: any, completed?: boolean }) => {
      if (!execution?.id) throw new Error("No execution ID");
      
      const params: any = { 
        id: execution.id,
        notes 
      };
      
      if (completed) {
        params.end_time = new Date().toISOString();
        params.status = stepResults.every(r => r) ? "passed" : "failed";
      } else if (status) {
        params.status = status;
      }
      
      return await updateTestExecution(params);
    },
    onSuccess: (data) => {
      setExecution(data);
    }
  });

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
      toast({
        title: "Test execution completed",
        description: "The test execution has been completed successfully."
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error completing test",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const initiateExecution = () => {
    if (testCaseId && !execution && !createExecutionMutation.isPending && user?.id) {
      createExecutionMutation.mutate();
    }
  }

  return {
    testCase,
    execution,
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
  };
};
