
import React, { useEffect } from "react";
import { parameterService } from "@/lib/utils/parameterService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Control, useWatch } from "react-hook-form";
import { TestCaseFormValues } from "./TestCaseFormTypes";
import { Parameter } from "@/types/parameter";

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
    const stepsParams = parameterService.extractParameters(steps || "").map(p => p.name);
    const expectedParams = parameterService.extractParameters(expectedResult || "").map(p => p.name);
    
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
