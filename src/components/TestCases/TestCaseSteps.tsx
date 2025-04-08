
import React from "react";
import { Controller, Control, FieldErrors, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TestCaseFormValues } from "./TestCaseFormTypes";
import { DetectedParameters } from "./DetectedParameters";
import { highlightParameters } from "@/lib/utils/parameterUtils";

interface TestCaseStepsProps {
  control: Control<TestCaseFormValues>;
  errors: FieldErrors<TestCaseFormValues>;
  isLoading: boolean;
  onParametersDetected: (parameters: string[]) => void;
}

export const TestCaseSteps: React.FC<TestCaseStepsProps> = ({
  control,
  errors,
  isLoading,
  onParametersDetected,
}) => {
  const steps = useWatch({ control, name: "steps" });
  const expectedResult = useWatch({ control, name: "expected_result" });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="steps">Steps</Label>
        <div className="mb-2 text-sm text-gray-500">
          Use $parameter to define variables (e.g., "Select $site" or "Type $password")
        </div>
        <Controller
          name="steps"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea {...field} id="steps" placeholder="Enter test steps" disabled={isLoading} />
          )}
        />
        {errors.steps && <p className="text-red-500 text-sm">{errors.steps.message}</p>}
        {steps && (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            <div className="text-xs font-semibold mb-1">Preview:</div>
            <div className="text-sm whitespace-pre-line">
              {highlightParameters(steps)}
            </div>
          </div>
        )}
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
        {expectedResult && (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            <div className="text-xs font-semibold mb-1">Preview:</div>
            <div className="text-sm whitespace-pre-line">
              {highlightParameters(expectedResult)}
            </div>
          </div>
        )}
      </div>

      <DetectedParameters 
        control={control} 
        onParametersDetected={onParametersDetected}
      />
    </div>
  );
};
