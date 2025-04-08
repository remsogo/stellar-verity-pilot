
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

  const dbTestCases = data as DbTestCase[];
  return dbTestCases.map(mapDbTestCaseToTestCase);
};
