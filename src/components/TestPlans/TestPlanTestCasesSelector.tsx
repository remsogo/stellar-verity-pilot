
import React from "react";
import { useFormContext } from "react-hook-form";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TestCase } from "@/types";
import { TestPlan } from "@/types/testPlan";

interface TestPlanTestCasesSelectorProps {
  availableTestCases: TestCase[];
  selectedTestCases: string[];
  isLoading: boolean;
  toggleTestCase: (testCaseId: string) => void;
}

export const TestPlanTestCasesSelector: React.FC<TestPlanTestCasesSelectorProps> = ({ 
  availableTestCases, 
  selectedTestCases, 
  isLoading,
  toggleTestCase 
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Select test cases to include in this test plan. You can add or remove test cases later.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          availableTestCases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableTestCases.map(testCase => (
                  <TableRow key={testCase.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedTestCases.includes(testCase.id)}
                        onCheckedChange={() => toggleTestCase(testCase.id)}
                      />
                    </TableCell>
                    <TableCell>{testCase.title}</TableCell>
                    <TableCell>{testCase.priority}</TableCell>
                    <TableCell>{testCase.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No test cases available. Create test cases first to add them to this plan.
            </div>
          )
        )}
      </CardContent>
    </>
  );
};
