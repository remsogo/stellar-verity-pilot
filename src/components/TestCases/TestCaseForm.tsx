
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TestCaseBasicInfo } from "./TestCaseBasicInfo";
import { TestCaseSteps } from "./TestCaseSteps";
import { TestCaseMetadata } from "./TestCaseMetadata";
import { TestCaseButtons } from "./TestCaseButtons";
import { TestCaseTags } from "./TestCaseTags";
import { useTestCaseForm } from "@/hooks/use-test-case-form";
import { TestCaseDataDrivenForm } from "./TestCaseDataDrivenForm";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TestCaseFormProps {
  id?: string;
}

export const TestCaseForm: React.FC<TestCaseFormProps> = ({ id }) => {
  const { selectedProjectId } = useSelectedProject();
  const navigate = useNavigate();

  const {
    isLoading,
    control,
    errors,
    handleSubmit,
    onSubmit,
    detectedParameters,
    handleParametersDetected
  } = useTestCaseForm(id);

  // If no project is selected, show a message and redirect button
  if (!selectedProjectId) {
    return (
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle>{id ? "Edit Test Case" : "Create New Test Case"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No Project Selected</h3>
          <p className="text-muted-foreground mb-6">
            You need to select a project before creating or editing test cases.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Go to Projects
          </Button>
        </CardContent>
      </Card>
    );
  }

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

          <TestCaseDataDrivenForm
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
