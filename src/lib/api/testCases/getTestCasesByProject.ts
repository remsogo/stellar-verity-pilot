
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "../testCaseMappers";

export const getTestCasesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, test_steps(*)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching test cases by project:", error);
    throw new Error(`Error fetching test cases: ${error.message}`);
  }

  // Map the database results to the application model
  return data.map((item) => mapDbTestCaseToTestCase(item as DbTestCase));
};
