
import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseStepsProps {
  control: Control<TestCaseFormValues>;
  errors: FieldErrors<TestCaseFormValues>;
  isLoading: boolean;
}

export const TestCaseSteps: React.FC<TestCaseStepsProps> = ({
  control,
  errors,
  isLoading,
}) => {
  return (
    <>
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
    </>
  );
};
