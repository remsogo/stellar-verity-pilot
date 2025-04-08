
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Récupère un cas de test par son ID
 */
export const getTestCase = async (id: string): Promise<TestCase> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test case: ${error.message}`);
  }

  const dbTestCase = data as DbTestCase;
  return mapDbTestCaseToTestCase(dbTestCase);
};
