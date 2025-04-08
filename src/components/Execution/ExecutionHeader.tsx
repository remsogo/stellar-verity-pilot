
import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { TestCase } from "@/types";

interface ExecutionHeaderProps {
  testCase: TestCase;
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({ testCase }) => {
  return (
    <CardHeader>
      <h3 className="text-lg font-semibold">Test Case: {testCase.title}</h3>
      <p className="text-sm text-muted-foreground">
        Description: {testCase.description || "No description provided"}
      </p>
    </CardHeader>
  );
};
