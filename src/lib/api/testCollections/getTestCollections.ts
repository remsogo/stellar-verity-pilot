
import { supabase } from "@/integrations/supabase/client";
import { TestCollection } from "@/types";

/**
 * Fetches all test collections for a given project
 */
export const getTestCollections = async (projectId: string): Promise<TestCollection[]> => {
  const { data, error } = await supabase
    .from("test_collections")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Error fetching test collections: ${error.message}`);
  }

  return data as TestCollection[] || [];
};
