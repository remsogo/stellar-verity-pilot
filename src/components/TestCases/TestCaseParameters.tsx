
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseParametersProps {
  control: Control<TestCaseFormValues>;
  isLoading: boolean;
}

export const TestCaseParameters: React.FC<TestCaseParametersProps> = ({
  control,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          name="data_driven"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              id="data_driven"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          )}
        />
        <Label htmlFor="data_driven">Parameterized Test</Label>
      </div>
      
      <Controller
        name="data_driven"
        control={control}
        render={({ field }) => (
          field.value && (
            <div className="space-y-2">
              <Label htmlFor="parameters">Test Parameters</Label>
              <Alert className="mb-2">
                <InfoIcon className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Define parameters that will be filled in during test execution. Enter in JSON format.
                  <div className="mt-1 font-mono text-xs">
                    Example: {`[{"name": "username", "type": "string", "description": "Login username"}, {"name": "password", "type": "string"}]`}
                  </div>
                </AlertDescription>
              </Alert>
              <Controller
                name="parameters"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="parameters"
                    placeholder={`[{"name": "username", "type": "string", "description": "Login username"}, {"name": "password", "type": "string"}]`}
                    className="h-40 font-mono"
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          )
        )}
      />
    </div>
  );
};
