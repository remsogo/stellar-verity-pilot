
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ExecutionStep, TestExecution } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Tag, FileText, Zap } from "lucide-react";
import { ExecutionStatusBadge } from './ExecutionStatusBadge';
import { ExecutionStepCard } from './ExecutionStepCard';
import { ExecutionSummaryCard } from './ExecutionSummaryCard';
import { TestCaseInfoCard } from './TestCaseInfoCard';

interface ExecutionDetailsContentProps {
  execution: TestExecution;
  executionSteps: ExecutionStep[];
  navigate: NavigateFunction;
}

export const ExecutionDetailsContent: React.FC<ExecutionDetailsContentProps> = ({ 
  execution, 
  executionSteps, 
  navigate 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate execution time in minutes
  const executionTimeMinutes = execution.endTime && execution.startTime 
    ? Math.round((new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 60000) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="md:col-span-2 backdrop-blur-sm border border-muted/40 shadow-lg">
        <CardHeader>
          <CardTitle>{execution.testCase.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <ExecutionStatusBadge status={execution.status} />
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {executionTimeMinutes} min
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {new Date(execution.startTime).toLocaleDateString()}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5" />
              {execution.executor}
            </Badge>
            {execution.testCase.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Test Case Description</h3>
              <p className="text-sm">{execution.testCase.description || "No description provided."}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Environment</h3>
                <p className="text-sm flex items-center">
                  {execution.environment}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Date</h3>
                <p className="text-sm flex items-center">
                  {formatDate(execution.startTime)}
                </p>
              </div>
            </div>

            {execution.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Notes</h3>
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  {execution.notes}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Test Steps</h3>
              {executionSteps.length === 0 ? (
                <p className="text-muted-foreground italic">No test steps recorded.</p>
              ) : (
                <div className="space-y-6">
                  {executionSteps.map((step) => (
                    <ExecutionStepCard key={step.id} step={step} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between pt-0">
          <Button 
            variant="outline"
            onClick={() => navigate(`/test-cases/${execution.testCaseId}`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Test Case
          </Button>
          <Button 
            className="bg-primary flex items-center"
            onClick={() => navigate(`/test-execution/${execution.testCaseId}`)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Run Test Again
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        <ExecutionSummaryCard 
          status={execution.status} 
          steps={executionSteps} 
        />
        
        <TestCaseInfoCard testCase={execution.testCase} />
      </div>
    </div>
  );
};
