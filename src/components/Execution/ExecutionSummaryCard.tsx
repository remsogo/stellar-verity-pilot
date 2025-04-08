
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionStep, Status } from '@/types';
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface ExecutionSummaryCardProps {
  status: Status;
  steps: ExecutionStep[];
}

export const ExecutionSummaryCard: React.FC<ExecutionSummaryCardProps> = ({ status, steps }) => {
  // Calculate step statistics
  const totalSteps = steps.length;
  const passedSteps = steps.filter(step => step.status === 'passed').length;
  const failedSteps = steps.filter(step => step.status === 'failed').length;
  const pendingSteps = steps.filter(step => step.status === 'pending').length;
  const blockedSteps = steps.filter(step => step.status === 'blocked').length;
  
  // Calculate pass percentage
  const passPercentage = totalSteps ? Math.round((passedSteps / totalSteps) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Execution Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative h-24 w-24">
            <div 
              className="h-24 w-24 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                background: `conic-gradient(
                  ${status === 'passed' ? '#10b981' : status === 'failed' ? '#ef4444' : '#6b7280'} ${passPercentage}%, 
                  #e5e7eb ${passPercentage}% 100%
                )`
              }}
            >
              <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center">
                {passPercentage}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium">Passed</span>
            </div>
            <span className="text-sm font-medium">{passedSteps}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <span className="text-sm font-medium">{failedSteps}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium">Blocked</span>
            </div>
            <span className="text-sm font-medium">{blockedSteps}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <span className="text-sm font-medium">{pendingSteps}</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Steps</span>
              <span className="text-sm font-medium">{totalSteps}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
