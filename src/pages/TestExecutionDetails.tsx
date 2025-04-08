
import { MainLayout } from "@/components/Layout/MainLayout";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExecutionDetailsLoadingState } from "@/components/Execution/ExecutionDetailsLoadingState";
import { ExecutionDetailsNotFound } from "@/components/Execution/ExecutionDetailsNotFound";
import { ExecutionDetailsContent } from "@/components/Execution/ExecutionDetailsContent";
import { TestExecution, ExecutionStep } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getExecutionDetails } from "@/lib/api/testExecutions";

const TestExecutionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);

  const { data: execution, isLoading, error } = useQuery({
    queryKey: ["execution", id],
    queryFn: async () => {
      if (!id) throw new Error("No execution ID provided");
      return await getExecutionDetails(id);
    },
    enabled: !!id
  });

  useEffect(() => {
    const fetchExecutionSteps = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .rpc('get_execution_steps_with_details', { execution_id: id });
        
        if (error) throw error;
        setExecutionSteps(data as ExecutionStep[]);
      } catch (err: any) {
        toast({
          title: "Error fetching execution steps",
          description: err.message,
          variant: "destructive"
        });
      }
    };

    if (id) {
      fetchExecutionSteps();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <MainLayout
        pageTitle="Execution Details"
        pageDescription="View detailed results of a test execution."
      >
        <ExecutionDetailsLoadingState />
      </MainLayout>
    );
  }

  if (error || !execution) {
    return (
      <MainLayout
        pageTitle="Execution Details"
        pageDescription="View detailed results of a test execution."
      >
        <ExecutionDetailsNotFound navigate={navigate} />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      pageTitle="Execution Details"
      pageDescription="View detailed results of a test execution."
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/test-executions")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Executions
        </Button>
      </div>
      
      <ExecutionDetailsContent 
        execution={execution} 
        executionSteps={executionSteps} 
        navigate={navigate}
      />
    </MainLayout>
  );
};

export default TestExecutionDetails;
