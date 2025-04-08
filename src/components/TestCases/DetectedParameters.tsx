
import React, { useEffect } from "react";
import { extractParametersFromText } from "@/lib/utils/parameterUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Control, useWatch } from "react-hook-form";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface DetectedParametersProps {
  control: Control<TestCaseFormValues>;
  onParametersDetected: (parameters: string[]) => void;
}

export const DetectedParameters: React.FC<DetectedParametersProps> = ({ 
  control,
  onParametersDetected
}) => {
  const steps = useWatch({ control, name: "steps" });
  const expectedResult = useWatch({ control, name: "expected_result" });
  
  // Detect parameters in steps and expected result
  const detectedParameters = React.useMemo(() => {
    const stepsParams = extractParametersFromText(steps || "");
    const expectedParams = extractParametersFromText(expectedResult || "");
    
    // Combine and remove duplicates
    return [...new Set([...stepsParams, ...expectedParams])];
  }, [steps, expectedResult]);
  
  // Call onParametersDetected when parameters change
  useEffect(() => {
    onParametersDetected(detectedParameters);
  }, [detectedParameters, onParametersDetected]);
  
  if (detectedParameters.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-4">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Detected Parameters</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex flex-wrap gap-2">
          {detectedParameters.map((param) => (
            <Badge key={param} variant="outline" className="bg-blue-50">
              ${param}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
