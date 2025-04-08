
import { supabase } from "@/integrations/supabase/client";
import { TestCase } from "@/types";

export const getTestCase = async (id: string): Promise<TestCase> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test case: ${error.message}`);
  }

  return data as TestCase;
};

export const updateTestCase = async (testCase: Partial<TestCase> & { id: string }): Promise<TestCase> => {
  const { data, error } = await supabase
    .from("test_cases")
    .update(testCase)
    .eq("id", testCase.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test case: ${error.message}`);
  }

  return data as TestCase;
};
