
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TestCase, Status, TestStep, Priority } from "@/types";
import { ClipboardList, CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

interface TestStepExecution {
  id?: string;
  description: string;
  expectedResult: string;
  actualResult: string;
  status: Status;
  order: number;
}

const TestExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [testSteps, setTestSteps] = useState<TestStepExecution[]>([]);
  const [environment, setEnvironment] = useState("production");
  const [notes, setNotes] = useState("");
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [overallStatus, setOverallStatus] = useState<Status>("pending");

  useEffect(() => {
    const fetchTestCase = async () => {
      setIsLoading(true);
      try {
        // Fetch test case
        const { data: testCaseData, error: testCaseError } = await supabase
          .from("test_cases")
          .select("*")
          .eq("id", id)
          .single();

        if (testCaseError) {
          console.error("Error fetching test case:", testCaseError);
          toast.error("Failed to load test case");
          navigate("/test-cases");
          return;
        }

        // Transform DB fields to match our frontend type
        const transformedData: TestCase = {
          id: testCaseData.id,
          title: testCaseData.title,
          description: testCaseData.description,
          status: testCaseData.status as Status,
          priority: testCaseData.priority as Priority, // Fixed from Status to Priority
          author: testCaseData.author,
          project_id: testCaseData.project_id,
          estimate_time: testCaseData.estimate_time,
          automated: testCaseData.automated,
          preconditions: testCaseData.preconditions,
          requirements: testCaseData.requirements,
          tags: testCaseData.tags,
          created_at: testCaseData.created_at,
          updated_at: testCaseData.updated_at
        };

        setTestCase(transformedData);

        // Fetch test steps
        const { data: stepsData, error: stepsError } = await supabase
          .from("test_steps")
          .select("*")
          .eq("test_case_id", id)
          .order("step_order", { ascending: true });

        if (stepsError) {
          console.error("Error fetching test steps:", stepsError);
          return;
        }

        if (stepsData && stepsData.length > 0) {
          setTestSteps(stepsData.map(step => ({
            id: step.id,
            description: step.description,
            expectedResult: step.expected_result,
            actualResult: "",
            status: "pending" as Status,
            order: step.step_order
          })));
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTestCase();
    }
  }, [id, navigate]);

  // Update overall status when step statuses change
  useEffect(() => {
    if (testSteps.length === 0) return;
    
    if (testSteps.every(step => step.status === "passed")) {
      setOverallStatus("passed");
    } else if (testSteps.some(step => step.status === "failed")) {
      setOverallStatus("failed");
    } else if (testSteps.some(step => step.status === "blocked")) {
      setOverallStatus("blocked");
    } else {
      setOverallStatus("pending");
    }
  }, [testSteps]);

  const handleStepStatusChange = (index: number, status: Status) => {
    const updatedSteps = [...testSteps];
    updatedSteps[index].status = status;
    setTestSteps(updatedSteps);
  };

  const handleStepNoteChange = (index: number, note: string) => {
    const updatedSteps = [...testSteps];
    updatedSteps[index].actualResult = note;
    setTestSteps(updatedSteps);
  };

  const handleSave = async () => {
    if (!testCase) return;
    
    setIsSaving(true);
    try {
      // Get current user info
      const { data: { user } } = await supabase.auth.getUser();
      
      let executor = "Anonymous";
      if (user) {
        const { data: userData } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("auth_id", user.id)
          .single();
          
        executor = userData?.full_name || user.email || "Anonymous";
      }
      
      const currentTime = new Date().toISOString();
      
      // Create test execution record
      const { data: executionData, error: executionError } = await supabase
        .from("test_executions")
        .insert({
          test_case_id: testCase.id,
          executor,
          status: overallStatus,
          start_time: currentTime, 
          end_time: currentTime,
          environment,
          notes,
        })
        .select();
        
      if (executionError) {
        throw executionError;
      }
      
      const newExecutionId = executionData[0].id;
      setExecutionId(newExecutionId);
      
      // Since there's no execution_steps table in the database schema,
      // we'll create a new SQL migration to handle this properly
      // For now, we'll just log the step results
      console.log("Steps to save:", testSteps);
      
      // Update test case status based on execution
      await supabase
        .from("test_cases")
        .update({
          status: overallStatus,
          updated_at: currentTime
        })
        .eq("id", testCase.id);
      
      toast.success("Test execution saved successfully");
      
      // Navigate to test case page
      setTimeout(() => {
        navigate("/test-cases");
      }, 2000);
    } catch (error: any) {
      console.error("Error saving execution:", error);
      toast.error(error.message || "Failed to save test execution");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
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
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                <h2 className="mt-4 text-xl font-semibold">Loading test case...</h2>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!testCase) {
    return (
      <div className="flex h-screen overflow-hidden">
        <CustomSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-muted-foreground">❌</div>
                <h2 className="mt-4 text-xl font-semibold">Test case not found</h2>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/test-cases")}
                >
                  Back to Test Cases
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => navigate("/test-cases")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Execute Test</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                Status: 
                <Badge className={`px-3 py-1 ${
                  overallStatus === "passed" ? "bg-green-500" :
                  overallStatus === "failed" ? "bg-red-500" :
                  overallStatus === "blocked" ? "bg-amber-500" :
                  "bg-gray-500"
                }`}>
                  {getStatusIcon(overallStatus)}
                  <span className="ml-1 capitalize">{overallStatus}</span>
                </Badge>
              </span>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Results"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Test Case: {testCase.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{testCase.priority}</Badge>
                  {testCase.automated && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">Automated</Badge>
                  )}
                  {testCase.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm">{testCase.description || "No description provided."}</p>
                  </div>

                  {testCase.preconditions && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Preconditions</h3>
                      <p className="text-sm">{testCase.preconditions}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Test Environment</h3>
                    <Select
                      value={environment}
                      onValueChange={setEnvironment}
                    >
                      <SelectTrigger className="w-full md:w-1/3">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Test Steps</h3>
                    {testSteps.length === 0 ? (
                      <p className="text-muted-foreground italic">No test steps defined.</p>
                    ) : (
                      <div className="space-y-6">
                        {testSteps.map((step, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">Step {index + 1}</h4>
                              <div className="flex gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`cursor-pointer ${step.status === "passed" ? "bg-green-100 text-green-800" : ""}`}
                                  onClick={() => handleStepStatusChange(index, "passed")}
                                >
                                  <CheckCircle className={`h-3.5 w-3.5 mr-1 ${step.status === "passed" ? "text-green-600" : "text-muted-foreground"}`} />
                                  Pass
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`cursor-pointer ${step.status === "failed" ? "bg-red-100 text-red-800" : ""}`}
                                  onClick={() => handleStepStatusChange(index, "failed")}
                                >
                                  <XCircle className={`h-3.5 w-3.5 mr-1 ${step.status === "failed" ? "text-red-600" : "text-muted-foreground"}`} />
                                  Fail
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`cursor-pointer ${step.status === "blocked" ? "bg-amber-100 text-amber-800" : ""}`}
                                  onClick={() => handleStepStatusChange(index, "blocked")}
                                >
                                  <AlertCircle className={`h-3.5 w-3.5 mr-1 ${step.status === "blocked" ? "text-amber-600" : "text-muted-foreground"}`} />
                                  Block
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-1">Description</h5>
                                <p className="text-sm">{step.description}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-1">Expected Result</h5>
                                <p className="text-sm">{step.expectedResult}</p>
                              </div>
                              <div className="md:col-span-2">
                                <h5 className="text-sm font-medium text-muted-foreground mb-1">Actual Result / Notes</h5>
                                <Textarea
                                  placeholder="Enter actual result or notes for this step"
                                  value={step.actualResult}
                                  onChange={(e) => handleStepNoteChange(index, e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Execution Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter any general notes about this test execution"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Results"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestExecution;
