import { supabase } from "@/integrations/supabase/client";
import { DbTestExecution, TestExecution, Status } from "@/types";
import { mapDbTestCaseToTestCase } from "./testCaseMappers";

// Helper to convert DB model to frontend model
const mapDbExecutionToExecution = (dbExecution: DbTestExecution): TestExecution => {
  const execution: TestExecution = {
    id: dbExecution.id,
    testCaseId: dbExecution.test_case_id,
    testCase: dbExecution.testCase ? mapDbTestCaseToTestCase(dbExecution.testCase) : {
      id: '',
      title: '',
      description: '',
      status: "pending",
      priority: "medium",
      author: '',
      project_id: '',
      tags: [],
      children: []
    },
    executor: dbExecution.executor,
    status: dbExecution.status as Status, // Use the Status type
    startTime: dbExecution.start_time,
    endTime: dbExecution.end_time,
    environment: dbExecution.environment,
    notes: dbExecution.notes || "",
    defects: dbExecution.defects || []
  };

  return execution;
};

export const getTestExecution = async (testCaseId: string): Promise<TestExecution | null> => {
  // Try to find an existing execution for this test case that isn't completed
  const { data, error } = await supabase
    .from("test_executions")
    .select(`*, testCase:test_cases(*)`)
    .eq("test_case_id", testCaseId)
    .is("end_time", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    throw new Error(`Error fetching test execution: ${error.message}`);
  }
  
  return data ? mapDbExecutionToExecution(data as DbTestExecution) : null;
};

export const getExecutionDetails = async (executionId: string): Promise<TestExecution> => {
  const { data, error } = await supabase
    .from("test_executions")
    .select(`*, testCase:test_cases(*)`)
    .eq("id", executionId)
    .single();
  
  if (error) {
    throw new Error(`Error fetching execution details: ${error.message}`);
  }
  
  return mapDbExecutionToExecution(data as DbTestExecution);
};

export const createTestExecution = async (params: {
  test_case_id: string;
  user_id: string;
}): Promise<TestExecution> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("test_executions")
    .insert({
      test_case_id: params.test_case_id,
      executor: params.user_id,
      status: "pending",
      start_time: now,
      environment: "Development"
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating test execution: ${error.message}`);
  }
  
  return mapDbExecutionToExecution(data as DbTestExecution);
};

export const updateTestExecution = async (params: {
  id: string;
  status?: Status;
  notes?: string;
  end_time?: string;
}): Promise<TestExecution> => {
  const { data, error } = await supabase
    .from("test_executions")
    .update({
      status: params.status,
      notes: params.notes,
      end_time: params.end_time
    })
    .eq("id", params.id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating test execution: ${error.message}`);
  }
  
  return mapDbExecutionToExecution(data as DbTestExecution);
};

// Get all test executions for a project
export const getTestExecutions = async (projectId: string): Promise<TestExecution[]> => {
  // Join with test_cases to get project filtered executions
  const { data, error } = await supabase
    .from("test_executions")
    .select(`*, testCase:test_cases(*)`)
    .eq("testCase.project_id", projectId)
    .order("created_at", { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching test executions: ${error.message}`);
  }
  
  return (data || []).map(item => mapDbExecutionToExecution(item as DbTestExecution));
};
