
import { TestCase } from "@/types";
import { TestCaseCard } from "./TestCaseCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

interface TestCaseListProps {
  testCases: TestCase[];
  title?: string;
}

export const TestCaseList = ({ testCases, title = "Recent Test Cases" }: TestCaseListProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{testCases.length} test cases</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {testCases.map((testCase) => (
            <TestCaseCard key={testCase.id} testCase={testCase} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
