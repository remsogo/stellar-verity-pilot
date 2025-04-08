
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, User, Tag, FileText, Zap } from "lucide-react";
import { TestExecution, TestCase, Status, Priority, ExecutionStep } from "@/types";
import { toast } from "sonner";
import { ExecutionStatusBadge } from "@/components/Execution/ExecutionStatusBadge";
import { ExecutionStepCard } from "@/components/Execution/ExecutionStepCard";
import { ExecutionSummaryCard } from "@/components/Execution/ExecutionSummaryCard";
import { TestCaseInfoCard } from "@/components/Execution/TestCaseInfoCard";

// Define the interface for the RPC function return type
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

// Interface for the RPC function parameters
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
          // This is the fixed line - correcting the generic types in the RPC call
          const { data, error: stepsError } = await supabase
            .rpc<ExecutionStepWithDetails[], GetExecutionStepsParams>(
              'get_execution_steps_with_details', 
              { execution_id_param: id }
            );

          if (stepsError) {
            console.error("Error fetching steps:", stepsError);
            toast.error("Could not load execution step details");
          } else if (data) {
            // Ensure data is an array before proceeding
            const stepsArray = Array.isArray(data) ? data : [];
            if (stepsArray.length > 0) {
              const formattedSteps: ExecutionStep[] = stepsArray.map((step: ExecutionStepWithDetails) => ({
                id: step.id,
                test_step_id: step.test_step_id,
                execution_id: step.execution_id,
                status: step.status as Status,
                actual_result: step.actual_result,
                step_order: step.step_order,
                description: step.description || "No description",
                expected_result: step.expected_result || "No expected result"
              }));
              
              setExecutionSteps(formattedSteps);
            }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-10 bg-muted rounded-full mb-4 animate-spin"></div>
                  <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-40 bg-muted/60 rounded"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="flex h-screen overflow-hidden">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-xl font-medium">Execution not found</div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/test-executions")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Executions
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calculate execution time in minutes
  const executionTimeMinutes = execution.endTime && execution.startTime 
    ? Math.round((new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 60000) 
    : 0;

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2 backdrop-blur-sm border border-muted/40 shadow-lg">
              <CardHeader>
                <CardTitle>{execution.testCase.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <ExecutionStatusBadge status={execution.status} />
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {executionTimeMinutes} min
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {new Date(execution.startTime).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    {execution.executor}
                  </Badge>
                  {execution.testCase.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Test Case Description</h3>
                    <p className="text-sm">{execution.testCase.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Environment</h3>
                      <p className="text-sm flex items-center">
                        {execution.environment}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Date</h3>
                      <p className="text-sm flex items-center">
                        {formatDate(execution.startTime)}
                      </p>
                    </div>
                  </div>

                  {execution.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Notes</h3>
                      <div className="bg-muted/50 p-3 rounded-md text-sm">
                        {execution.notes}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Test Steps</h3>
                    {executionSteps.length === 0 ? (
                      <p className="text-muted-foreground italic">No test steps recorded.</p>
                    ) : (
                      <div className="space-y-6">
                        {executionSteps.map((step) => (
                          <ExecutionStepCard key={step.id} step={step} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between pt-0">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/test-cases/${execution.testCaseId}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Test Case
                </Button>
                <Button 
                  className="bg-primary flex items-center"
                  onClick={() => navigate(`/test-execution/${execution.testCaseId}`)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Run Test Again
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <ExecutionSummaryCard 
                status={execution.status} 
                steps={executionSteps} 
              />
              
              <TestCaseInfoCard testCase={execution.testCase} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestExecutionDetails;
