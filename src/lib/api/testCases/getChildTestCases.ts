
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

/**
 * Récupère les cas de test enfants d'un cas de test parent
 */
export const getChildTestCases = async (parentId: string): Promise<TestCase[]> => {
  try {
    // Query for child test cases with the given parent_id
    const { data, error } = await supabase
      .from("test_cases")
      .select("*, steps:test_steps(*)")
      .eq("parent_id", parentId);

    if (error) {
      console.error("Error fetching child test cases:", error);
      throw new Error(`Error fetching child test cases: ${error.message}`);
    }

    // Map DB test cases to frontend model
    const testCases = (data as DbTestCase[]).map(dbTestCase => 
      mapDbTestCaseToTestCase(dbTestCase)
    );
    
    return testCases;
  } catch (error: any) {
    console.error("Error in getChildTestCases:", error);
    throw error;
  }
};
