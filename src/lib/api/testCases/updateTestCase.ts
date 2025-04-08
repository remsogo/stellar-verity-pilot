
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase, Priority, Status } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Met à jour un cas de test existant
 */
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
