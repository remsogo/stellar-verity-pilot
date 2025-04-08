
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { TestStep } from "@/types";

interface TestExecutionStepProps {
  step: TestStep;
  stepNumber: number;
  totalSteps: number;
  onStepResult: (result: boolean) => void;
  result?: boolean;
}

export const TestExecutionStep: React.FC<TestExecutionStepProps> = ({
  step,
  stepNumber,
  totalSteps,
  onStepResult,
  result
}) => {
  return (
    <Card className="border border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-primary/10 w-8 h-8 rounded-full text-sm font-bold text-primary">
              {stepNumber}
            </span>
            <span className="text-sm text-muted-foreground">Step {stepNumber} of {totalSteps}</span>
          </div>
          {result !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm ${result ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result ? 'Passed' : 'Failed'}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
          <p className="text-sm">{step.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Expected Result</h3>
          <p className="text-sm">{step.expectedResult}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => onStepResult(false)}
          className={result === false ? 'bg-red-100 border-red-200 text-red-700' : ''}
          size="sm"
        >
          <X className="mr-1 h-4 w-4" />
          Fail
        </Button>
        <Button 
          onClick={() => onStepResult(true)}
          className={result === true ? 'bg-green-700' : ''}
          size="sm"
        >
          <Check className="mr-1 h-4 w-4" />
          Pass
        </Button>
      </CardFooter>
    </Card>
  );
};
