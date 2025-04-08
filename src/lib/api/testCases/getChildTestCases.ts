
import { supabase } from "@/integrations/supabase/client";
import { TestCase } from "@/types/testCase";

// Type for child test cases without recursive structure
export type ChildTestCase = Omit<TestCase, 'children'>;

/**
 * Fetches all child test cases for a given parent test case
 */
export const getChildTestCases = async (parentId: string): Promise<ChildTestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*")
    .eq("parent_id", parentId);

  if (error) {
    throw new Error(`Error fetching child test cases: ${error.message}`);
  }

  return data as ChildTestCase[];
};
