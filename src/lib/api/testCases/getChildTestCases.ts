
import { supabase } from "@/integrations/supabase/client";

/**
 * Simplified type for child test cases to avoid circular references
 */
export interface ChildTestCase {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  author: string;
  project_id: string;
  estimate_time?: number;
  automated?: boolean;
  preconditions?: string;
  requirements?: string[];
  tags: string[];
  is_parent?: boolean;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

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
