
import { TestCase } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCaseCardProps {
  testCase: TestCase;
}

export const TestCaseCard = ({ testCase }: TestCaseCardProps) => {
  const statusColors = {
    passed: "status-passed",
    failed: "status-failed",
    pending: "status-pending",
    blocked: "status-blocked",
  };

  const priorityVariants = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{testCase.title}</CardTitle>
          <span className={cn("status-badge", statusColors[testCase.status])}>
            {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{testCase.description}</p>
        <div className="flex items-center text-sm space-x-4">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">
              {new Date(testCase.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="outline" className={cn("text-xs font-normal", priorityVariants[testCase.priority])}>
            {testCase.priority}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex-wrap gap-1">
        {testCase.tags.slice(0, 3).map((tag) => (
          <div
            key={tag}
            className="flex items-center text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </div>
        ))}
        {testCase.tags.length > 3 && (
          <div className="text-xs text-muted-foreground px-2 py-1">
            +{testCase.tags.length - 3} more
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
