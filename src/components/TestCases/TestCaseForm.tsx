
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { TestCaseBasicInfo } from "./TestCaseBasicInfo";
import { TestCaseRelationship } from "./TestCaseRelationship";
import { TestCaseSteps } from "./TestCaseSteps";
import { TestCaseMetadata } from "./TestCaseMetadata";
import { testCaseSchema, TestCaseFormValues } from "./TestCaseFormTypes";

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
        
        // Pour la simplicité, concaténer tous les steps en une seule chaîne
        if (data.test_steps && data.test_steps.length > 0) {
          const stepsText = data.test_steps.map((step: any) => step.description).join("\n");
          setValue("steps", stepsText);
          
          // Utiliser le résultat attendu du premier step pour la simplicité
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
