
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Status, TestExecution, TestCase, ExecutionStep, Priority } from "@/types";
import { toast } from "sonner";
import { ExecutionDetailsContent } from "@/components/Execution/ExecutionDetailsContent";
import { ExecutionDetailsLoadingState } from "@/components/Execution/ExecutionDetailsLoadingState";
import { ExecutionDetailsNotFound } from "@/components/Execution/ExecutionDetailsNotFound";

// Define types for the RPC function
interface ExecutionStepWithDetails {
  id: string;
  test_step_id: string;
  execution_id: string;
  status: string;
  actual_result: string | null;
  step_order: number;
  description: string;
  expected_result: string;
}

// Type for the RPC function parameters
interface GetExecutionStepsParams {
  execution_id_param: string;
}

const TestExecutionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [execution, setExecution] = useState<TestExecution | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExecutionDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch execution data
        const { data: executionData, error: executionError } = await supabase
          .from("test_executions")
          .select("*")
          .eq("id", id)
          .single();

        if (executionError) {
          throw executionError;
        }

        // Fetch test case data
        const { data: testCaseData, error: testCaseError } = await supabase
          .from("test_cases")
          .select("*")
          .eq("id", executionData.test_case_id)
          .single();

        if (testCaseError) {
          throw testCaseError;
        }

        const testCase: TestCase = {
          id: testCaseData.id,
          title: testCaseData.title,
          description: testCaseData.description,
          status: testCaseData.status as Status,
          priority: testCaseData.priority as Priority,
          author: testCaseData.author,
          project_id: testCaseData.project_id,
          automated: testCaseData.automated,
          tags: testCaseData.tags || [],
          requirements: testCaseData.requirements || [],
          estimate_time: testCaseData.estimate_time,
          preconditions: testCaseData.preconditions,
          created_at: testCaseData.created_at,
          updated_at: testCaseData.updated_at
        };

        // Create execution object
        const executionObj: TestExecution = {
          id: executionData.id,
          testCaseId: executionData.test_case_id,
          testCase: testCase,
          executor: executionData.executor,
          status: executionData.status as Status,
          startTime: executionData.start_time,
          endTime: executionData.end_time || executionData.start_time,
          environment: executionData.environment,
          notes: executionData.notes || "",
          defects: executionData.defects || []
        };

        setExecution(executionObj);

        // Fetch execution steps with test step details
        if (id) {
          // Completely refactored approach to avoid typing issues
          const { data, error: stepsError } = await supabase
            .from('execution_steps')
            .select(`
              id,
              test_step_id,
              execution_id,
              status,
              actual_result,
              step_order,
              test_steps (
                description,
                expected_result
              )
            `)
            .eq('execution_id', id)
            .order('step_order');

          if (stepsError) {
            console.error("Error fetching steps:", stepsError);
            toast.error("Could not load execution step details");
          } else if (data && data.length > 0) {
            const formattedSteps: ExecutionStep[] = data.map((step) => ({
              id: step.id,
              test_step_id: step.test_step_id,
              execution_id: step.execution_id,
              status: step.status as Status,
              actual_result: step.actual_result,
              step_order: step.step_order,
              description: step.test_steps?.description || "No description",
              expected_result: step.test_steps?.expected_result || "No expected result"
            }));
              
            setExecutionSteps(formattedSteps);
          }
        }
      } catch (error) {
        console.error("Error fetching execution details:", error);
        toast.error("Failed to load execution details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExecutionDetails();
    }
  }, [id]);

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background to-background/95">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate("/test-executions")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Execution Details</h1>
          </div>

          {isLoading ? (
            <ExecutionDetailsLoadingState />
          ) : !execution ? (
            <ExecutionDetailsNotFound navigate={navigate} />
          ) : (
            <ExecutionDetailsContent 
              execution={execution} 
              executionSteps={executionSteps} 
              navigate={navigate} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TestExecutionDetails;
