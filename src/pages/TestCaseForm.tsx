
import { MainLayout } from "@/components/Layout/MainLayout";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";

const testCaseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  steps: z.string().min(5, { message: "Steps must be at least 5 characters." }),
  expected_result: z.string().min(5, { message: "Expected result must be at least 5 characters." }),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Draft", "Ready", "Blocked"]).default("Draft"),
  parent_id: z.string().nullable().optional(),
  is_parent: z.boolean().default(false),
});

type TestCaseSchema = z.infer<typeof testCaseSchema>;

const TestCaseForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [parentTestCases, setParentTestCases] = useState<Array<{ id: string; title: string }>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedProjectId } = useSelectedProject();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TestCaseSchema>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      priority: "Medium",
      status: "Draft",
      is_parent: false,
      parent_id: null,
    },
  });

  const isParent = watch("is_parent");
  const parentId = watch("parent_id");

  useEffect(() => {
    if (id) {
      fetchTestCase(id);
    }
    if (selectedProjectId) {
      fetchParentTestCases();
    }
  }, [id, selectedProjectId]);

  const fetchParentTestCases = async () => {
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .select("id, title")
        .eq("project_id", selectedProjectId)
        .eq("is_parent", true);

      if (error) {
        throw error;
      }

      if (data) {
        setParentTestCases(data);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching parent test cases",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchTestCase = async (testCaseId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .select("*, test_steps(description, expected_result)")
        .eq("id", testCaseId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setValue("title", data.title);
        setValue("description", data.description || "");
        setValue("preconditions", data.preconditions || "");
        
        // For simplicity, concatenate all steps into a single string
        if (data.test_steps && data.test_steps.length > 0) {
          const stepsText = data.test_steps.map((step: any) => step.description).join("\n");
          setValue("steps", stepsText);
          
          // Use the expected result from the first step for simplicity
          setValue("expected_result", data.test_steps[0].expected_result);
        } else {
          setValue("steps", "");
          setValue("expected_result", "");
        }
        
        setValue("priority", data.priority === "high" ? "High" : data.priority === "medium" ? "Medium" : "Low");
        setValue("status", data.status === "Draft" || data.status === "Ready" || data.status === "Blocked" 
          ? data.status 
          : "Draft");
        
        // Utilisons des assertions de type pour gérer correctement is_parent et parent_id
        if ('is_parent' in data) {
          // Conversion explicite en boolean avec !!
          setValue("is_parent", !!data.is_parent);
        }
        
        if ('parent_id' in data) {
          // Utiliser une assertion de type et une conversion sécurisée
          const parentId = data.parent_id as string | null;
          setValue("parent_id", parentId);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching test case",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TestCaseSchema) => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "You must select a project first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // If it's a parent test, remove any parent_id
      if (data.is_parent) {
        data.parent_id = null;
      }
      
      const testCaseData = {
        title: data.title,
        description: data.description,
        preconditions: data.preconditions,
        priority: data.priority.toLowerCase(),
        status: data.status,
        author: "Current User", // This would be the actual user in a real application
        project_id: selectedProjectId,
        is_parent: data.is_parent,
        parent_id: data.parent_id,
        tags: []
      };
      
      if (id) {
        const { error } = await supabase
          .from("test_cases")
          .update(testCaseData)
          .eq("id", id);

        if (error) {
          throw error;
        }

        // Update the test steps separately
        // For simplicity we're not implementing this fully

        toast({
          title: "Test case updated",
          description: "The test case has been successfully updated.",
        });
      } else {
        const { data: newTestCase, error } = await supabase
          .from("test_cases")
          .insert([testCaseData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        // For simplicity we're not implementing steps creation fully here

        toast({
          title: "Test case created",
          description: "The test case has been successfully created.",
        });
      }
      navigate("/test-cases");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout 
      pageTitle={id ? "Edit Test Case" : "Create Test Case"} 
      pageDescription={id ? "Update an existing test case." : "Create a new test case for your project."}
    >
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle>{id ? "Edit Test Case" : "Create New Test Case"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input {...field} id="title" placeholder="Enter test case title" disabled={isLoading} />
                )}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea {...field} id="description" placeholder="Enter test case description" disabled={isLoading} />
                )}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Test Case Relationship Section */}
            <div className="bg-muted/50 p-4 rounded-md space-y-4">
              <h3 className="text-md font-medium">Test Case Relationship</h3>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_parent"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="is_parent" 
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="is_parent">This is a parent test case</Label>
                    </div>
                  )}
                />
              </div>
              
              {!isParent && (
                <div>
                  <Label htmlFor="parent_id">Parent Test Case (optional)</Label>
                  <Controller
                    name="parent_id"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                        disabled={isLoading || parentTestCases.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent test case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {parentTestCases.map((testCase) => (
                            <SelectItem key={testCase.id} value={testCase.id}>
                              {testCase.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="preconditions">Preconditions</Label>
              <Controller
                name="preconditions"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea {...field} id="preconditions" placeholder="Enter preconditions" disabled={isLoading} />
                )}
              />
              {errors.preconditions && <p className="text-red-500 text-sm">{errors.preconditions.message}</p>}
            </div>

            <div>
              <Label htmlFor="steps">Steps</Label>
              <Controller
                name="steps"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea {...field} id="steps" placeholder="Enter test steps" disabled={isLoading} />
                )}
              />
              {errors.steps && <p className="text-red-500 text-sm">{errors.steps.message}</p>}
            </div>

            <div>
              <Label htmlFor="expected_result">Expected Result</Label>
              <Controller
                name="expected_result"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea {...field} id="expected_result" placeholder="Enter expected result" disabled={isLoading} />
                )}
              />
              {errors.expected_result && <p className="text-red-500 text-sm">{errors.expected_result.message}</p>}
            </div>

            <div className="flex space-x-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => navigate("/test-cases")}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TestCaseForm;
