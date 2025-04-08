
import { supabase } from "@/integrations/supabase/client";
import { TestPlan, DbTestPlan } from "@/types/testPlan";

// Helper to convert DB model to frontend model
export const mapDbTestPlanToTestPlan = (dbTestPlan: DbTestPlan): TestPlan => {
  return {
    id: dbTestPlan.id,
    title: dbTestPlan.title,
    description: dbTestPlan.description,
    project_id: dbTestPlan.project_id,
    status: dbTestPlan.status as 'draft' | 'active' | 'completed' | 'archived',
    test_cases: dbTestPlan.test_cases || [],
    created_by: dbTestPlan.created_by,
    created_at: dbTestPlan.created_at,
    updated_at: dbTestPlan.updated_at
  };
};

export const getTestPlans = async (projectId: string): Promise<TestPlan[]> => {
  // Use type assertion to let TypeScript know we're using the correct table
  const { data, error } = await supabase
    .from("test_plans")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Error fetching test plans: ${error.message}`);
  }

  // Use type assertion to safely convert the returned data
  return (data as unknown as DbTestPlan[]).map(mapDbTestPlanToTestPlan);
};

export const getTestPlan = async (id: string): Promise<TestPlan> => {
  const { data, error } = await supabase
    .from("test_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test plan: ${error.message}`);
  }

  return mapDbTestPlanToTestPlan(data as unknown as DbTestPlan);
};

export const createTestPlan = async (testPlan: Partial<TestPlan>): Promise<TestPlan> => {
  const dbTestPlan = {
    title: testPlan.title || "New Test Plan",
    description: testPlan.description,
    project_id: testPlan.project_id,
    status: testPlan.status || "draft",
    test_cases: testPlan.test_cases || [],
    created_by: testPlan.created_by
  };

  const { data, error } = await supabase
    .from("test_plans")
    .insert([dbTestPlan]) // Wrap in array for insert
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test plan: ${error.message}`);
  }

  return mapDbTestPlanToTestPlan(data as unknown as DbTestPlan);
};

export const updateTestPlan = async (testPlan: Partial<TestPlan> & { id: string }): Promise<TestPlan> => {
  const dbTestPlan = {
    title: testPlan.title,
    description: testPlan.description,
    status: testPlan.status,
    test_cases: testPlan.test_cases
  };

  const { data, error } = await supabase
    .from("test_plans")
    .update(dbTestPlan)
    .eq("id", testPlan.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test plan: ${error.message}`);
  }

  return mapDbTestPlanToTestPlan(data as unknown as DbTestPlan);
};

export const deleteTestPlan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("test_plans")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting test plan: ${error.message}`);
  }
};
