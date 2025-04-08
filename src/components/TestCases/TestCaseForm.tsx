import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { TestCaseBasicInfo } from "./TestCaseBasicInfo";
import { TestCaseRelationship } from "./TestCaseRelationship";
import { TestCaseSteps } from "./TestCaseSteps";
import { TestCaseMetadata } from "./TestCaseMetadata";
import { testCaseSchema, TestCaseFormValues } from "./TestCaseFormTypes";
import { getTestCase } from "@/lib/api/testCases/getTestCase";
import { createTestCase } from "@/lib/api/testCases/createTestCase";
import { updateTestCase } from "@/lib/api/testCases/updateTestCase";

interface TestCaseFormProps {
  id?: string;
}

export const TestCaseForm: React.FC<TestCaseFormProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parentTestCases, setParentTestCases] = useState<Array<{ id: string; title: string }>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedProjectId } = useSelectedProject();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      priority: "Medium",
      status: "Draft",
      is_parent: false,
      parent_id: null,
    },
  });

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
      const testCase = await getTestCase(testCaseId);
      
      setValue("title", testCase.title);
      setValue("description", testCase.description || "");
      setValue("preconditions", testCase.preconditions || "");
      
      if (testCase.steps && testCase.steps.length > 0) {
        const stepsText = testCase.steps.map(step => step.description).join("\n");
        setValue("steps", stepsText);
        
        setValue("expected_result", testCase.steps[0].expectedResult);
      } else {
        setValue("steps", "");
        setValue("expected_result", "");
      }
      
      const formattedPriority = testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1);
      setValue("priority", formattedPriority as "High" | "Medium" | "Low");
      
      setValue("status", 
        (testCase.status === "Draft" || testCase.status === "Ready" || testCase.status === "Blocked") 
          ? testCase.status 
          : "Draft"
      );
      
      setValue("is_parent", Boolean(testCase.is_parent));
      
      setValue("parent_id", testCase.parent_id || null);
      
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

  const onSubmit = async (data: TestCaseFormValues) => {
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
      if (data.is_parent) {
        data.parent_id = null;
      }
      
      const testCaseData = {
        title: data.title,
        description: data.description,
        preconditions: data.preconditions,
        priority: data.priority.toLowerCase() as any,
        status: data.status,
        author: "Current User",
        project_id: selectedProjectId,
        is_parent: data.is_parent,
        parent_id: data.parent_id,
        tags: [] as string[]
      };
      
      if (id) {
        await updateTestCase({
          id,
          ...testCaseData
        });
        
        toast({
          title: "Test case updated",
          description: "The test case has been successfully updated.",
        });
      } else {
        await createTestCase(testCaseData);
        
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
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle>{id ? "Edit Test Case" : "Create New Test Case"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TestCaseBasicInfo 
            control={control} 
            errors={errors} 
            isLoading={isLoading} 
          />

          <TestCaseRelationship 
            control={control}
            isLoading={isLoading}
            parentTestCases={parentTestCases}
            watch={watch}
          />

          <TestCaseSteps 
            control={control} 
            errors={errors} 
            isLoading={isLoading} 
          />

          <TestCaseMetadata 
            control={control} 
          />

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => navigate("/test-cases")}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
