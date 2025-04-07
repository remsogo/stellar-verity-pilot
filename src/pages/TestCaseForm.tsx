
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navigation/Navbar";
import { CustomSidebar } from "@/components/UI/CustomSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCase, Status, Priority } from "@/types";
import { Check, ChevronLeft, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface TestStepForm {
  id?: string;
  description: string;
  expectedResult: string;
  order: number;
}

const TestCaseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [testCase, setTestCase] = useState<Partial<TestCase>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    preconditions: "",
    automated: false,
    tags: [],
    requirements: [],
    project_id: ""
  });

  const [testSteps, setTestSteps] = useState<TestStepForm[]>([{ 
    description: "", 
    expectedResult: "", 
    order: 1 
  }]);
  
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name");

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data || []);
      
      // Set the first project as default if creating a new test case
      if (!isEditing && data && data.length > 0) {
        setTestCase(prev => ({ ...prev, project_id: data[0].id }));
      }
    };

    fetchProjects();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      const fetchTestCase = async () => {
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
        const transformedData = {
          id: testCaseData.id,
          title: testCaseData.title,
          description: testCaseData.description,
          status: testCaseData.status as Status,
          priority: testCaseData.priority as Priority,
          author: testCaseData.author,
          project_id: testCaseData.project_id,
          estimate_time: testCaseData.estimate_time,
          automated: testCaseData.automated,
          preconditions: testCaseData.preconditions,
          requirements: testCaseData.requirements,
          tags: testCaseData.tags
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
            order: step.step_order
          })));
        }
      };

      fetchTestCase();
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestCase(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTestCase(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setTestCase(prev => ({ ...prev, [name]: checked }));
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const updatedSteps = [...testSteps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setTestSteps(updatedSteps);
  };

  const addStep = () => {
    setTestSteps([
      ...testSteps, 
      { description: "", expectedResult: "", order: testSteps.length + 1 }
    ]);
  };

  const removeStep = (index: number) => {
    if (testSteps.length === 1) {
      toast.error("Test case must have at least one step");
      return;
    }
    
    const updatedSteps = testSteps.filter((_, i) => i !== index);
    // Update order for each step
    updatedSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    
    setTestSteps(updatedSteps);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!testCase.tags?.includes(tagInput.trim())) {
        setTestCase(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTestCase(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    if (!testCase.title) {
      toast.error("Title is required");
      return false;
    }
    
    if (!testCase.project_id) {
      toast.error("Project is required");
      return false;
    }
    
    // Validate steps
    for (const step of testSteps) {
      if (!step.description || !step.expectedResult) {
        toast.error("All test steps must have a description and expected result");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current user for author field if creating a new test case
      let author = testCase.author;
      if (!isEditing) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("user_profiles")
            .select("full_name")
            .eq("auth_id", user.id)
            .single();
            
          author = userData?.full_name || user.email || "Anonymous";
        } else {
          author = "Anonymous";
        }
      }
      
      // Save test case
      let testCaseId = id;
      
      if (isEditing) {
        // Update existing test case
        const { error } = await supabase
          .from("test_cases")
          .update({
            title: testCase.title,
            description: testCase.description,
            status: testCase.status,
            priority: testCase.priority,
            preconditions: testCase.preconditions,
            automated: testCase.automated,
            tags: testCase.tags,
            project_id: testCase.project_id,
            estimate_time: testCase.estimate_time,
            requirements: testCase.requirements,
            updated_at: new Date().toISOString()
          })
          .eq("id", id);
          
        if (error) throw error;
      } else {
        // Create new test case
        const { data, error } = await supabase
          .from("test_cases")
          .insert({
            title: testCase.title!,
            description: testCase.description,
            status: testCase.status as Status,
            priority: testCase.priority as Priority,
            preconditions: testCase.preconditions,
            automated: testCase.automated,
            tags: testCase.tags || [],
            project_id: testCase.project_id!,
            estimate_time: testCase.estimate_time,
            requirements: testCase.requirements || [],
            author
          })
          .select();
          
        if (error) throw error;
        testCaseId = data[0].id;
      }
      
      // Save test steps
      if (isEditing) {
        // Delete existing steps that are not in the current list
        const currentStepIds = testSteps
          .filter(step => step.id)
          .map(step => step.id);
          
        if (currentStepIds.length > 0) {
          await supabase
            .from("test_steps")
            .delete()
            .eq("test_case_id", testCaseId)
            .not("id", "in", `(${currentStepIds.join(",")})`);
        }
      }
      
      // Update or insert steps
      for (const step of testSteps) {
        if (step.id) {
          // Update existing step
          await supabase
            .from("test_steps")
            .update({
              description: step.description,
              expected_result: step.expectedResult,
              step_order: step.order,
              updated_at: new Date().toISOString()
            })
            .eq("id", step.id);
        } else {
          // Insert new step
          await supabase
            .from("test_steps")
            .insert({
              test_case_id: testCaseId,
              description: step.description,
              expected_result: step.expectedResult,
              step_order: step.order
            });
        }
      }
      
      toast.success(`Test case ${isEditing ? "updated" : "created"} successfully`);
      navigate("/test-cases");
    } catch (error: any) {
      console.error("Error saving test case:", error);
      toast.error(error.message || "Failed to save test case");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  type="button"
                  onClick={() => navigate("/test-cases")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isEditing ? "Edit Test Case" : "Create Test Case"}
                </h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/test-cases")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {isEditing ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Test Case Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={testCase.title}
                      onChange={handleInputChange}
                      placeholder="Enter test case title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={testCase.description || ""}
                      onChange={handleInputChange}
                      placeholder="Describe the purpose of this test case"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preconditions">Preconditions</Label>
                    <Textarea
                      id="preconditions"
                      name="preconditions"
                      value={testCase.preconditions || ""}
                      onChange={handleInputChange}
                      placeholder="List any preconditions required for this test"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Select
                        value={testCase.project_id}
                        onValueChange={(value) => handleSelectChange("project_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={testCase.status}
                        onValueChange={(value) => handleSelectChange("status", value as Status)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={testCase.priority}
                        onValueChange={(value) => handleSelectChange("priority", value as Priority)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estimateTime">Estimated Time (minutes)</Label>
                      <Input
                        id="estimateTime"
                        name="estimate_time"
                        type="number"
                        min={0}
                        value={testCase.estimate_time || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="automated"
                      checked={testCase.automated || false}
                      onCheckedChange={(checked) => handleSwitchChange("automated", checked)}
                    />
                    <Label htmlFor="automated">Automated Test</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {testCase.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tagInput"
                      placeholder="Add tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testSteps.map((step, index) => (
                      <div key={index} className="space-y-3 p-3 border rounded-md relative">
                        <div className="absolute top-3 right-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeStep(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="font-medium text-sm mb-2">Step {index + 1}</div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`step-${index}-description`}>Description</Label>
                          <Textarea
                            id={`step-${index}-description`}
                            value={step.description}
                            onChange={(e) => handleStepChange(index, "description", e.target.value)}
                            placeholder="Describe what to do in this step"
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`step-${index}-expected`}>Expected Result</Label>
                          <Textarea
                            id={`step-${index}-expected`}
                            value={step.expectedResult}
                            onChange={(e) => handleStepChange(index, "expectedResult", e.target.value)}
                            placeholder="What should happen after this step"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addStep}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default TestCaseForm;
