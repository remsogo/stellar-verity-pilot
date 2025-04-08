
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TestCycle } from "@/types/testCycle";
import { Clock, CheckCircle, Play, AlertCircle } from "lucide-react";

interface TestCyclesListProps {
  testCycles: TestCycle[];
}

export const TestCyclesList: React.FC<TestCyclesListProps> = ({ testCycles }) => {
  if (testCycles.length === 0) {
    return (
      <div className="text-center p-10 bg-muted/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No Test Cycles Found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first test cycle to start organizing your test execution.
        </p>
        <Button asChild>
          <Link to="/test-cycles/new">Create Test Cycle</Link>
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "active":
        return <Play className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = (testCycle: TestCycle) => {
    if (!testCycle.execution_progress) return "bg-gray-300";
    
    const { passed, failed, total } = testCycle.execution_progress;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    
    if (failed > 0) return "bg-red-500";
    if (passRate === 100) return "bg-green-500";
    if (passRate > 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getProgressValue = (testCycle: TestCycle) => {
    if (!testCycle.execution_progress) return 0;
    
    const { passed, failed, blocked, total } = testCycle.execution_progress;
    const completedCount = passed + failed + blocked;
    
    return total > 0 ? (completedCount / total) * 100 : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testCycles.map((testCycle) => (
        <Card key={testCycle.id} className="glass-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{testCycle.name}</CardTitle>
              <Badge className="ml-2 flex items-center gap-1">
                {getStatusIcon(testCycle.status)}
                <span>{testCycle.status}</span>
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {testCycle.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Test Plan</p>
              <p className="font-medium">{testCycle.testPlan?.title || "Unknown"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p>{format(new Date(testCycle.start_date), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p>{format(new Date(testCycle.end_date), "MMM d, yyyy")}</p>
              </div>
            </div>
            
            {testCycle.execution_progress && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Execution Progress</span>
                  <span>
                    {testCycle.execution_progress.passed + testCycle.execution_progress.failed + testCycle.execution_progress.blocked} 
                    /{testCycle.execution_progress.total}
                  </span>
                </div>
                <Progress 
                  value={getProgressValue(testCycle)} 
                  className={getProgressColor(testCycle)} 
                />
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">
                    Passed: {testCycle.execution_progress.passed}
                  </span>
                  <span className="text-red-600">
                    Failed: {testCycle.execution_progress.failed}
                  </span>
                  <span className="text-yellow-600">
                    Blocked: {testCycle.execution_progress.blocked}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={`/test-cycles/${testCycle.id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
