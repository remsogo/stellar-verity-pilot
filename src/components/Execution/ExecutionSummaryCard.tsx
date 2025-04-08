
import { Gauge } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ExecutionStatusBadge } from "./ExecutionStatusBadge";
import { ExecutionStep, Status } from "@/types";

interface ExecutionSummaryCardProps {
  status: Status;
  steps: ExecutionStep[];
}

export const ExecutionSummaryCard = ({ status, steps }: ExecutionSummaryCardProps) => {
  const passedSteps = steps.filter(step => step.status === "passed").length;
  const failedSteps = steps.filter(step => step.status === "failed").length;
  const blockedSteps = steps.filter(step => step.status === "blocked").length;
  const passRate = steps.length ? Math.round((passedSteps / steps.length) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-background to-muted/40 border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-primary" />
          Execution Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-md text-center shadow-sm">
              <div className="text-sm text-muted-foreground">Total Steps</div>
              <div className="text-2xl font-bold mt-1">{steps.length}</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-md text-center shadow-sm">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="flex justify-center mt-1">
                <ExecutionStatusBadge status={status} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50/80 backdrop-blur-sm dark:bg-green-900/20 p-3 rounded-md text-center shadow-sm">
              <div className="text-sm text-green-600 dark:text-green-400">Passed</div>
              <div className="text-xl font-bold mt-1 text-green-700 dark:text-green-300">
                {passedSteps}
              </div>
            </div>
            <div className="bg-red-50/80 backdrop-blur-sm dark:bg-red-900/20 p-3 rounded-md text-center shadow-sm">
              <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
              <div className="text-xl font-bold mt-1 text-red-700 dark:text-red-300">
                {failedSteps}
              </div>
            </div>
            <div className="bg-amber-50/80 backdrop-blur-sm dark:bg-amber-900/20 p-3 rounded-md text-center shadow-sm">
              <div className="text-sm text-amber-600 dark:text-amber-400">Blocked</div>
              <div className="text-xl font-bold mt-1 text-amber-700 dark:text-amber-300">
                {blockedSteps}
              </div>
            </div>
          </div>

          <div className="bg-background/80 backdrop-blur-sm p-4 rounded-md shadow-sm mt-4">
            <h3 className="text-sm font-medium mb-2">Pass Rate</h3>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600" 
                style={{ width: `${passRate}%` }}
              />
            </div>
            <div className="text-right text-sm mt-1">
              {passRate}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
