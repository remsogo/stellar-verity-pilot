
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExecutionStep, TestCaseStatus } from '@/types';
import { AlertTriangle, Check, Clock, X } from 'lucide-react';

interface ExecutionStepCardProps {
  step: ExecutionStep;
}

export const ExecutionStepCard: React.FC<ExecutionStepCardProps> = ({ step }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case TestCaseStatus.PASSED:
        return <Check className="h-5 w-5 text-green-500" />;
      case TestCaseStatus.FAILED:
        return <X className="h-5 w-5 text-red-500" />;
      case TestCaseStatus.BLOCKED:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusClass = () => {
    switch (step.status) {
      case TestCaseStatus.PASSED:
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30';
      case TestCaseStatus.FAILED:
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30';
      case TestCaseStatus.BLOCKED:
        return 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30';
      default:
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30';
    }
  };

  return (
    <Card className={`border ${getStatusClass()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getStatusIcon()}</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">Step {step.step_order}: {step.description}</h4>
            <div className="text-xs text-muted-foreground mb-2">
              <strong>Expected:</strong> {step.expected_result}
            </div>
            {step.actual_result && (
              <div className="text-xs mb-2">
                <strong>Actual:</strong> {step.actual_result}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
