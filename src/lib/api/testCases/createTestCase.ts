
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Crée un nouveau cas de test
 */
export const createTestCase = async (testCase: Partial<TestCase>): Promise<TestCase> => {
  // Convert frontend model to DB model for creation
  const dbTestCase = {
    title: testCase.title || "New Test Case",
    description: testCase.description,
    status: testCase.status || "pending",
    priority: testCase.priority || "medium",
    author: testCase.author,
    project_id: testCase.project_id,
    estimate_time: testCase.estimate_time,
    automated: testCase.automated || false,
    preconditions: testCase.preconditions,
    requirements: testCase.requirements,
    tags: testCase.tags || [],
    is_parent: testCase.is_parent || false,
    parent_id: testCase.parent_id
  };

  const { data, error } = await supabase
    .from("test_cases")
    .insert(dbTestCase)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test case: ${error.message}`);
  }

  return mapDbTestCaseToTestCase(data as DbTestCase);
};
