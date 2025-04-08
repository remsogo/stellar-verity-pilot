import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { TestCaseBasicInfo } from "./TestCaseBasicInfo";
import { TestCaseSteps } from "./TestCaseSteps";
import { TestCaseMetadata } from "./TestCaseMetadata";
import { TestCaseButtons } from "./TestCaseButtons";
import { TestCaseFormValues, testCaseSchema, convertFormPriorityToApiPriority, convertFormStatusToApiStatus, parseTestData, parseParameters } from "./TestCaseFormTypes";
import { getTestCase } from "@/lib/api/testCases/getTestCase";
import { createTestCase } from "@/lib/api/testCases/createTestCase";
import { updateTestCase } from "@/lib/api/testCases/updateTestCase";
import { Priority, Status } from "@/types";
import { TestCaseTags } from "./TestCaseTags";
import { TestCaseParameters } from "./TestCaseParameters";

interface TestCaseFormProps {
  id?: string;
}

export const TestCaseForm: React.FC<TestCaseFormProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectedParameters, setDetectedParameters] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedProjectId } = useSelectedProject();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      priority: "Medium",
      status: "Draft",
      tags: [],
      data_driven: false,
    },
  });

  // Fetch test case details if ID is provided
  useEffect(() => {
    if (id) {
      fetchTestCase(id);
    }
  }, [id]);

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
      
      let formattedStatus: "Draft" | "Ready" | "Blocked";
      const lowerStatus = testCase.status.toLowerCase();
      if (lowerStatus === "draft") {
        formattedStatus = "Draft";
      } else if (lowerStatus === "ready") {
        formattedStatus = "Ready";
      } else if (lowerStatus === "blocked") {
        formattedStatus = "Blocked";
      } else {
        formattedStatus = "Draft"; // Default fallback
      }
      setValue("status", formattedStatus);
      
      setValue("data_driven", testCase.data_driven || false);
      
      if (testCase.parameters) {
        setValue("parameters", JSON.stringify(testCase.parameters, null, 2));
      }
      
      setValue("tags", testCase.tags || []);
      
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

  const handleParametersDetected = (parameters: string[]) => {
    setDetectedParameters(parameters);
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
      const priorityValue: Priority = convertFormPriorityToApiPriority(data.priority);
      const statusValue: Status = convertFormStatusToApiStatus(data.status);
      
      let parsedParameters = parseParameters(data.parameters);
      if (!parsedParameters && detectedParameters.length > 0) {
        parsedParameters = detectedParameters.map(param => ({
          name: param,
          type: "string",
          description: `Parameter ${param}`,
          defaultValue: ""
        }));
      }
      
      const testCaseData = {
        title: data.title,
        description: data.description,
        preconditions: data.preconditions,
        priority: priorityValue,
        status: statusValue,
        author: "Current User",
        project_id: selectedProjectId,
        tags: data.tags || [],
        data_driven: Boolean(detectedParameters.length > 0 || data.data_driven),
        parameters: parsedParameters
      };
      
      if (id) {
        await updateTestCase({
          ...testCaseData,
          id
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

          <TestCaseTags 
            control={control}
            isLoading={isLoading}
          />

          <TestCaseSteps 
            control={control} 
            errors={errors} 
            isLoading={isLoading}
            onParametersDetected={handleParametersDetected}
          />

          <TestCaseParameters
            control={control}
            isLoading={isLoading}
            detectedParameters={detectedParameters}
          />

          <TestCaseMetadata 
            control={control} 
          />

          <Separator />

          <TestCaseButtons isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
};
