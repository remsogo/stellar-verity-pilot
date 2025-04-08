
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Récupère les cas de test enfants d'un cas de test parent
 */
export const getChildTestCases = async (parentId: string): Promise<TestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("parent_id", parentId);

  if (error) {
    throw new Error(`Error fetching child test cases: ${error.message}`);
  }

  // Convert each DbTestCase to TestCase with empty children arrays
  const testCases = (data as DbTestCase[]).map(testCase => mapDbTestCaseToTestCase(testCase));
  
  // Return the test cases with initialized children arrays
  return testCases;
};
