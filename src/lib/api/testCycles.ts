
import { supabase } from "@/integrations/supabase/client";
import { TestCycle, DbTestCycle, TestCycleStatus } from "@/types/testCycle";
import { getTestPlan } from "@/lib/api/testPlans";

// Helper to convert DB model to frontend model
export const mapDbTestCycleToTestCycle = async (dbTestCycle: DbTestCycle): Promise<TestCycle> => {
  // Get test plan details
  const testPlan = await getTestPlan(dbTestCycle.test_plan_id);
  
  // Get execution stats
  const { data: executionStats } = await supabase
    .from("test_executions")
    .select("status, count(*)")
    .eq("test_cycle_id", dbTestCycle.id)
    .group("status");
  
  let progress = {
    passed: 0,
    failed: 0,
    blocked: 0,
    pending: 0,
    total: testPlan.test_cases.length
  };
  
  if (executionStats) {
    executionStats.forEach((stat: any) => {
      if (stat.status === 'passed') progress.passed = stat.count;
      if (stat.status === 'failed') progress.failed = stat.count;
      if (stat.status === 'blocked') progress.blocked = stat.count;
      if (stat.status === 'pending') progress.pending = stat.count;
    });
  }
  
  return {
    id: dbTestCycle.id,
    name: dbTestCycle.name,
    description: dbTestCycle.description,
    project_id: dbTestCycle.project_id,
    test_plan_id: dbTestCycle.test_plan_id,
    testPlan: testPlan,
    status: dbTestCycle.status as TestCycleStatus,
    start_date: dbTestCycle.start_date,
    end_date: dbTestCycle.end_date,
    environment: dbTestCycle.environment,
    build_version: dbTestCycle.build_version,
    created_by: dbTestCycle.created_by,
    created_at: dbTestCycle.created_at,
    updated_at: dbTestCycle.updated_at,
    execution_progress: progress
  };
};

export const getTestCycles = async (projectId: string): Promise<TestCycle[]> => {
  const { data, error } = await supabase
    .from("test_cycles")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Error fetching test cycles: ${error.message}`);
  }

  const cycles: TestCycle[] = [];
  for (const cycle of data as DbTestCycle[]) {
    cycles.push(await mapDbTestCycleToTestCycle(cycle));
  }

  return cycles;
};

export const getTestCycle = async (id: string): Promise<TestCycle> => {
  const { data, error } = await supabase
    .from("test_cycles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test cycle: ${error.message}`);
  }

  return await mapDbTestCycleToTestCycle(data as DbTestCycle);
};

export const createTestCycle = async (testCycle: Omit<TestCycle, 'id' | 'created_at' | 'updated_at' | 'execution_progress'>): Promise<TestCycle> => {
  const dbTestCycle = {
    name: testCycle.name,
    description: testCycle.description,
    project_id: testCycle.project_id,
    test_plan_id: testCycle.test_plan_id,
    status: testCycle.status || "planned",
    start_date: testCycle.start_date,
    end_date: testCycle.end_date,
    environment: testCycle.environment,
    build_version: testCycle.build_version,
    created_by: testCycle.created_by
  };

  const { data, error } = await supabase
    .from("test_cycles")
    .insert([dbTestCycle])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test cycle: ${error.message}`);
  }

  return await mapDbTestCycleToTestCycle(data as DbTestCycle);
};

export const updateTestCycle = async (testCycle: Partial<TestCycle> & { id: string }): Promise<TestCycle> => {
  const dbTestCycle = {
    name: testCycle.name,
    description: testCycle.description,
    status: testCycle.status,
    start_date: testCycle.start_date,
    end_date: testCycle.end_date,
    environment: testCycle.environment,
    build_version: testCycle.build_version
  };

  const { data, error } = await supabase
    .from("test_cycles")
    .update(dbTestCycle)
    .eq("id", testCycle.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test cycle: ${error.message}`);
  }

  return await mapDbTestCycleToTestCycle(data as DbTestCycle);
};

export const deleteTestCycle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("test_cycles")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting test cycle: ${error.message}`);
  }
};
