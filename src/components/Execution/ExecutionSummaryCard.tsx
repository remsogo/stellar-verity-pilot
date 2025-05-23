
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestExecution } from '@/types';
import { format } from 'date-fns';
import { ExecutionStatusBadge } from './ExecutionStatusBadge';

interface ExecutionSummaryCardProps {
  execution: TestExecution;
}

export const ExecutionSummaryCard: React.FC<ExecutionSummaryCardProps> = ({ execution }) => {
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy HH:mm');
  };

  const calculateDuration = () => {
    if (!execution.startTime || !execution.endTime) return 'In progress';
    
    const start = new Date(execution.startTime);
    const end = new Date(execution.endTime);
    const durationMs = end.getTime() - start.getTime();
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Execution Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <ExecutionStatusBadge status={execution.status} />
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Executor</span>
            <span className="text-sm font-medium">{execution.executor}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Environment</span>
            <span className="text-sm font-medium capitalize">{execution.environment}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Build Version</span>
            <span className="text-sm font-medium">{execution.buildVersion || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Started</span>
            <span className="text-sm font-medium">
              {execution.startTime ? formatDateTime(execution.startTime) : 'Not started'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="text-sm font-medium">
              {execution.endTime ? formatDateTime(execution.endTime) : 'In progress'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm font-medium">{calculateDuration()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
