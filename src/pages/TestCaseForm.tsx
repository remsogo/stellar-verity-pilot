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

const testCaseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  steps: z.string().min(5, { message: "Steps must be at least 5 characters." }),
  expected_result: z.string().min(5, { message: "Expected result must be at least 5 characters." }),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Draft", "Ready", "Blocked"]).default("Draft"),
});

type TestCaseSchema = z.infer<typeof testCaseSchema>;

const TestCaseForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<TestCaseSchema>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      priority: "Medium",
      status: "Draft",
    },
  });

  useEffect(() => {
    if (id) {
      fetchTestCase(id);
    }
  }, [id]);

  const fetchTestCase = async (testCaseId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .select("*")
        .eq("id", testCaseId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setValue("title", data.title);
        setValue("description", data.description || "");
        setValue("preconditions", data.preconditions || "");
        setValue("steps", data.steps);
        setValue("expected_result", data.expected_result);
        setValue("priority", data.priority);
        setValue("status", data.status);
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
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase
          .from("test_cases")
          .update(data)
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast({
          title: "Test case updated",
          description: "The test case has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from("test_cases")
          .insert([data]);

        if (error) {
          throw error;
        }

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
