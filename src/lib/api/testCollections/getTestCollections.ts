
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

  return (data || []).map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isSmartCollection: collection.is_smart_collection,
    criteria: collection.criteria as Record<string, any> | null,
    testCaseIds: collection.test_case_ids || [],
    project_id: collection.project_id,
    created_at: collection.created_at,
    updated_at: collection.updated_at
  }));
};
