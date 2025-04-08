
import { supabase } from "@/integrations/supabase/client";
import { TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "@/lib/api/testCaseMappers";

/**
 * Fetches all child test cases for a given parent test case
 */
export const getChildTestCases = async (parentId: string): Promise<TestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("parent_id", parentId);

  if (error) {
    throw new Error(`Error fetching child test cases: ${error.message}`);
  }

  // Use the mapper to convert database objects to properly typed TestCase objects
  return (data || []).map(testCase => mapDbTestCaseToTestCase(testCase));
};
