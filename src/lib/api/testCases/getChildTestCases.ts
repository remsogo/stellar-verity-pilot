
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Récupère les cas de test enfants d'un cas de test parent
 */
export const getChildTestCases = async (parentId: string) => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("parent_id", parentId);

  if (error) {
    throw new Error(`Error fetching child test cases: ${error.message}`);
  }

  // Convert each DbTestCase to TestCase with empty children arrays
  return (data as DbTestCase[]).map(testCase => mapDbTestCaseToTestCase(testCase));
};
