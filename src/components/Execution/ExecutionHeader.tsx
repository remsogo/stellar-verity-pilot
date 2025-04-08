
import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { TestExecution } from "@/types";

interface ExecutionHeaderProps {
  execution: TestExecution;
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({ execution }) => {
  return (
    <CardHeader>
      <h3 className="text-lg font-semibold">Test Case: {execution.testCase.title}</h3>
      <p className="text-sm text-muted-foreground">
        Description: {execution.testCase.description || "No description provided"}
      </p>
    </CardHeader>
  );
};
