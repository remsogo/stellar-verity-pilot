
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
import { ArrowLeft, Calendar, Clock, User, Tag, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { TestExecution, TestCase, Status, Priority, ExecutionStep } from "@/types";
import { toast } from "sonner";

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
          // Fix the RPC typing by using the correct generic parameters
          const { data, error: stepsError } = await supabase
            .rpc<ExecutionStepWithDetails>('get_execution_steps_with_details', { 
              execution_id_param: id 
            });

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

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Status) => {
    return (
      <Badge className={`${
        status === "passed" ? "bg-green-100 text-green-800" :
        status === "failed" ? "bg-red-100 text-red-800" :
        status === "blocked" ? "bg-amber-100 text-amber-800" :
        "bg-blue-100 text-blue-800"
      }`}>
        <div className="flex items-center">
          {getStatusIcon(status)}
          <span className="ml-1.5 capitalize">{status}</span>
        </div>
      </Badge>
    );
  };

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
                <div className="animate-pulse">Loading execution details...</div>
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

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
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
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{execution.testCase.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(execution.status)}
                  <Badge variant="outline">{execution.environment}</Badge>
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
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Executed By</h3>
                      <p className="text-sm flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {execution.executor}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Date</h3>
                      <p className="text-sm flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
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
                        {executionSteps.map((step, index) => (
                          <div key={step.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">Step {step.step_order}</h4>
                              {getStatusBadge(step.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-1">Description</h5>
                                <p className="text-sm">{step.description}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-1">Expected Result</h5>
                                <p className="text-sm">{step.expected_result}</p>
                              </div>
                              {step.actual_result && (
                                <div className="md:col-span-2">
                                  <h5 className="text-sm font-medium text-muted-foreground mb-1">Actual Result</h5>
                                  <div className="bg-muted/50 p-3 rounded-md text-sm">
                                    {step.actual_result}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end pt-0">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/test-execution/${execution.testCaseId}`)}
                >
                  Run Test Again
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 p-3 rounded-md text-center">
                        <div className="text-sm text-muted-foreground">Total Steps</div>
                        <div className="text-2xl font-bold mt-1">{executionSteps.length}</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md text-center">
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="flex justify-center mt-1">
                          {getStatusBadge(execution.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-center">
                        <div className="text-sm text-green-600 dark:text-green-400">Passed</div>
                        <div className="text-xl font-bold mt-1 text-green-700 dark:text-green-300">
                          {executionSteps.filter(step => step.status === "passed").length}
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-center">
                        <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
                        <div className="text-xl font-bold mt-1 text-red-700 dark:text-red-300">
                          {executionSteps.filter(step => step.status === "failed").length}
                        </div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-center">
                        <div className="text-sm text-amber-600 dark:text-amber-400">Blocked</div>
                        <div className="text-xl font-bold mt-1 text-amber-700 dark:text-amber-300">
                          {executionSteps.filter(step => step.status === "blocked").length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Case Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Priority</div>
                      <div className="font-medium mt-0.5 capitalize">{execution.testCase.priority}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Author</div>
                      <div className="font-medium mt-0.5">{execution.testCase.author}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div className="font-medium mt-0.5">
                        {formatDate(execution.testCase.created_at || "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div className="font-medium mt-0.5">
                        {formatDate(execution.testCase.updated_at || "")}
                      </div>
                    </div>
                    {execution.testCase.automated !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Automation</div>
                        <div className="font-medium mt-0.5">
                          {execution.testCase.automated ? "Automated" : "Manual"}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/test-cases/${execution.testCaseId}`)}
                  >
                    View Test Case
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestExecutionDetails;
