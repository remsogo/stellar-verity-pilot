
import { TestExecution } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecutionTableProps {
  executions: TestExecution[];
}

export const ExecutionTable = ({ executions }: ExecutionTableProps) => {
  const statusColors = {
    passed: "status-passed",
    failed: "status-failed",
    pending: "status-pending",
    blocked: "status-blocked",
  };

  const formatDuration = (start: string, end: string) => {
    if (!end) return "In progress";
    
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Test Executions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Test case</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Executor</th>
                <th className="px-4 py-3 text-left font-medium">Environment</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Duration</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution) => (
                <tr key={execution.id} className="border-t border-border">
                  <td className="px-4 py-3">{execution.testCase.title}</td>
                  <td className="px-4 py-3">
                    <span className={cn("status-badge", statusColors[execution.status])}>
                      {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{execution.executor}</td>
                  <td className="px-4 py-3">{execution.environment}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      {new Date(execution.startTime).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatDuration(execution.startTime, execution.endTime)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
