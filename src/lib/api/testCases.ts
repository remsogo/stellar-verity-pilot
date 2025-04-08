
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase, TestStep } from "@/types";
import { mapDbTestCaseToTestCase } from "./testCaseMappers";

export const getTestCase = async (id: string): Promise<TestCase> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test case: ${error.message}`);
  }

  return mapDbTestCaseToTestCase(data as DbTestCase);
};

export const updateTestCase = async (testCase: Partial<TestCase> & { id: string }): Promise<TestCase> => {
  // Convert frontend model to DB model for update
  const dbTestCase: Partial<DbTestCase> = {
    id: testCase.id,
    title: testCase.title,
    description: testCase.description,
    status: testCase.status,
    priority: testCase.priority,
    automated: testCase.automated,
    estimate_time: testCase.estimate_time,
    preconditions: testCase.preconditions,
    requirements: testCase.requirements,
    tags: testCase.tags
  };

  const { data, error } = await supabase
    .from("test_cases")
    .update(dbTestCase)
    .eq("id", testCase.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test case: ${error.message}`);
  }

  return mapDbTestCaseToTestCase(data as DbTestCase);
};
