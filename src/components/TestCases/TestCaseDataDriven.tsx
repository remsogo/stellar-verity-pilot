
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseDataDrivenProps {
  control: Control<TestCaseFormValues>;
  isLoading: boolean;
}

export const TestCaseDataDriven: React.FC<TestCaseDataDrivenProps> = ({
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
        <Label htmlFor="data_driven">Data-Driven Test</Label>
      </div>
      
      <Controller
        name="data_driven"
        control={control}
        render={({ field }) => (
          field.value && (
            <div className="space-y-2">
              <Label htmlFor="test_data">Test Data Sets (JSON format)</Label>
              <Alert className="mb-2">
                <InfoIcon className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Enter test data sets in JSON format. Each set should have an id, name, and values object.
                  <div className="mt-1 font-mono text-xs">
                    Example: {`[{"id": "1", "name": "Valid User", "values": {"username": "john", "password": "secure123"}}]`}
                  </div>
                </AlertDescription>
              </Alert>
              <Controller
                name="test_data"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="test_data"
                    placeholder={`[{"id": "1", "name": "Test Set 1", "values": {"input1": "value1", "input2": "value2"}}]`}
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
