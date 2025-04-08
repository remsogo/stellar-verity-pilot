
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from 'react-router-dom';

interface ExecutionDetailsNotFoundProps {
  navigate: NavigateFunction;
}

export const ExecutionDetailsNotFound: React.FC<ExecutionDetailsNotFoundProps> = ({ navigate }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-xl font-medium">Execution not found</div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/test-executions")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Executions
        </Button>
      </div>
    </div>
  );
};
