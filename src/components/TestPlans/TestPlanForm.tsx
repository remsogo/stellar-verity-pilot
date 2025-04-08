
import { FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestPlan } from "@/types/testPlan";
import { TestPlanFormHeader } from "./TestPlanFormHeader";
import { TestPlanTestCasesSelector } from "./TestPlanTestCasesSelector";
import { useTestPlanForm } from "@/hooks/use-test-plan-form";

interface TestPlanFormProps {
  testPlan?: TestPlan;
  onSubmit: (data: Partial<TestPlan>) => Promise<void>;
  isLoading?: boolean;
}

export const TestPlanForm = ({ testPlan, onSubmit, isLoading = false }: TestPlanFormProps) => {
  const {
    methods,
    selectedTestCases,
    availableTestCases,
    isLoadingTestCases,
    isSubmitting,
    toggleTestCase,
    handleFormSubmit
  } = useTestPlanForm(onSubmit, testPlan);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
        <div className="space-y-4">
          <Card>
            <TestPlanFormHeader isEditing={!!testPlan} />
          </Card>
          
          <Card>
            <TestPlanTestCasesSelector 
              availableTestCases={availableTestCases}
              selectedTestCases={selectedTestCases}
              isLoading={isLoadingTestCases}
              toggleTestCase={toggleTestCase}
            />
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current"></div>
                  Saving...
                </>
              ) : testPlan ? "Update Test Plan" : "Create Test Plan"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
