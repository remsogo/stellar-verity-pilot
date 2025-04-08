
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExecutionStep } from '@/types';
import { Check, X } from "lucide-react";

interface ExecutionStepCardProps {
  step: ExecutionStep;
}

export const ExecutionStepCard: React.FC<ExecutionStepCardProps> = ({ step }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${step.status === 'passed' ? 'bg-green-100' : step.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'}`}>
            {step.status === 'passed' ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : step.status === 'failed' ? (
              <X className="h-5 w-5 text-red-600" />
            ) : (
              <span className="text-gray-600">{step.step_order}</span>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">Step {step.step_order}</h4>
            <p className="text-sm mt-1">{step.description}</p>
            <div className="mt-2 border-l-2 border-primary/30 pl-3">
              <p className="text-xs font-medium text-muted-foreground">Expected Result:</p>
              <p className="text-sm mt-0.5">{step.expected_result}</p>
            </div>
            {step.actual_result && (
              <div className="mt-2 border-l-2 border-secondary/30 pl-3">
                <p className="text-xs font-medium text-muted-foreground">Actual Result:</p>
                <p className="text-sm mt-0.5">{step.actual_result}</p>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
            step.status === 'passed' ? 'bg-green-100 text-green-800' : 
            step.status === 'failed' ? 'bg-red-100 text-red-800' : 
            step.status === 'blocked' ? 'bg-orange-100 text-orange-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {step.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
