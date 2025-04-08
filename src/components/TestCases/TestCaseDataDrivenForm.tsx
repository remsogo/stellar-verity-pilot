
import React, { useEffect } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { TestCaseFormValues } from "./TestCaseFormTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { parameterService } from "@/lib/utils/parameterService";

interface TestCaseDataDrivenFormProps {
  control: Control<TestCaseFormValues>;
  isLoading: boolean;
  detectedParameters: string[];
}

export const TestCaseDataDrivenForm: React.FC<TestCaseDataDrivenFormProps> = ({
  control,
  isLoading,
  detectedParameters,
}) => {
  const dataEnabled = useWatch({ control, name: "data_driven" });
  
  // Generate parameters JSON when detected parameters change
  useEffect(() => {
    if (detectedParameters.length > 0 && dataEnabled) {
      // Convert to Parameter objects
      const parameters = detectedParameters.map(param => ({
        name: param,
        type: "string",
        description: `Parameter for ${param}`,
        defaultValue: ""
      }));
      
      // Get the form's current parameters value
      const parametersField = document.getElementById("parameters") as HTMLTextAreaElement;
      if (parametersField && (!parametersField.value || parametersField.value === "[]")) {
        // Update the parameters field with the serialized parameters
        parametersField.value = parameterService.serializeParameters(parameters);
        // Trigger change event to update the form
        const event = new Event("input", { bubbles: true });
        parametersField.dispatchEvent(event);
      }
    }
  }, [detectedParameters, dataEnabled]);

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
            <div className="space-y-4">
              {detectedParameters.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Parameter Default Values</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 space-y-4">
                    {detectedParameters.map((param) => (
                      <div key={param} className="grid grid-cols-3 gap-4 items-center">
                        <Label htmlFor={`param-${param}`} className="col-span-1">
                          ${param}:
                        </Label>
                        <Input
                          id={`param-${param}`}
                          placeholder={`Default value for ${param}`}
                          className="col-span-2"
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="parameters">Parameters Definition (JSON)</Label>
                <Alert className="mb-2">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Parameters are automatically detected from your test steps. You can also manually define additional parameters here.
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
                      placeholder={`[{"name": "site", "type": "string", "description": "The site to test", "defaultValue": "example.com"}]`}
                      className="h-40 font-mono"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>
          )
        )}
      />
    </div>
  );
};
