
import { supabase } from "@/integrations/supabase/client";
import { TestExecution } from "@/types";

export interface TestExecutionCreate {
  test_case_id: string;
  user_id: string;
  step_results: boolean[];
  notes: string;
  completed: boolean;
}

export interface TestExecutionUpdate {
  id: string;
  step_results: boolean[];
  notes: string;
  completed: boolean;
}

export const getTestExecution = async (id: string): Promise<TestExecution> => {
  const { data, error } = await supabase
    .from("test_executions")
    .select("*, testCase:test_cases!test_case_id(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test execution: ${error.message}`);
  }

  return data as TestExecution;
};

export const createTestExecution = async (execution: TestExecutionCreate): Promise<TestExecution> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("test_executions")
    .insert({
      test_case_id: execution.test_case_id,
      executor: execution.user_id,
      status: "pending",
      start_time: now,
      environment: "Development",
      notes: execution.notes,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test execution: ${error.message}`);
  }

  return data as TestExecution;
};

export const updateTestExecution = async (execution: TestExecutionUpdate): Promise<TestExecution> => {
  const updateData: any = {
    notes: execution.notes,
  };
  
  if (execution.completed) {
    updateData.end_time = new Date().toISOString();
    updateData.status = execution.step_results.every(result => result) ? "passed" : "failed";
  }

  const { data, error } = await supabase
    .from("test_executions")
    .update(updateData)
    .eq("id", execution.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test execution: ${error.message}`);
  }

  return data as TestExecution;
};
