
import { supabase } from "@/integrations/supabase/client";
import { TestCycle, DbTestCycle, TestCycleStatus } from "@/types/testCycle";
import { getTestPlan } from "@/lib/api/testPlans";

// Helper to convert DB model to frontend model
export const mapDbTestCycleToTestCycle = async (dbTestCycle: DbTestCycle): Promise<TestCycle> => {
  // Get test plan details
  const testPlan = await getTestPlan(dbTestCycle.test_plan_id);
  
  // Create a basic progress object
  let progress = {
    passed: 0,
    failed: 0,
    blocked: 0,
    pending: 0,
    total: testPlan.test_cases.length
  };
  
  // Try to get execution stats if supported
  try {
    const { data: executionStats, error } = await supabase
      .from("test_executions")
      .select("status, count(*)")
      .eq("test_cycle_id", dbTestCycle.id)
      .in("status", ['passed', 'failed', 'blocked', 'pending'])
      .group_by('status') as any;
    
    if (executionStats && !error) {
      // Process the stats
      executionStats.forEach((stat: any) => {
        if (stat.status === 'passed') progress.passed = parseInt(stat.count) || 0;
        if (stat.status === 'failed') progress.failed = parseInt(stat.count) || 0;
        if (stat.status === 'blocked') progress.blocked = parseInt(stat.count) || 0;
        if (stat.status === 'pending') progress.pending = parseInt(stat.count) || 0;
      });
    }
  } catch (error) {
    console.error("Error fetching execution stats:", error);
    // Continue without execution stats
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

// Get all test cycles for a project
export const getTestCycles = async (projectId: string): Promise<TestCycle[]> => {
  try {
    // Use a more generic approach to handle tables not in the typed schema
    const result = await supabase.rpc('get_project_test_cycles', {
      p_project_id: projectId
    }) as any;
    
    if (result.error) {
      throw new Error(`Error fetching test cycles: ${result.error.message}`);
    }
    
    const cycles: TestCycle[] = [];
    if (result.data) {
      for (const cycle of result.data as DbTestCycle[]) {
        cycles.push(await mapDbTestCycleToTestCycle(cycle));
      }
    }
    
    return cycles;
  } catch (error: any) {
    // For development/testing, return an empty array if the table or RPC doesn't exist
    console.error("Error in getTestCycles:", error.message);
    return [];
  }
};

// Get a single test cycle by ID
export const getTestCycle = async (id: string): Promise<TestCycle> => {
  try {
    // Use a more generic approach
    const result = await supabase.rpc('get_test_cycle_by_id', {
      p_cycle_id: id
    }) as any;
    
    if (result.error) {
      throw new Error(`Error fetching test cycle: ${result.error.message}`);
    }
    
    if (!result.data || result.data.length === 0) {
      throw new Error(`Test cycle not found: ${id}`);
    }
    
    return await mapDbTestCycleToTestCycle(result.data[0] as DbTestCycle);
  } catch (error: any) {
    // For testing/development purpose, return a minimal object
    console.error("Error in getTestCycle:", error.message);
    throw error;
  }
};

// Create a new test cycle
export const createTestCycle = async (testCycle: Omit<TestCycle, 'id' | 'created_at' | 'updated_at' | 'execution_progress'>): Promise<TestCycle> => {
  try {
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
    
    // Use a more generic approach
    const result = await supabase.rpc('create_test_cycle', {
      cycle_data: dbTestCycle
    }) as any;
    
    if (result.error) {
      throw new Error(`Error creating test cycle: ${result.error.message}`);
    }
    
    if (!result.data) {
      throw new Error('Failed to create test cycle');
    }
    
    return await mapDbTestCycleToTestCycle(result.data as DbTestCycle);
  } catch (error: any) {
    console.error("Error in createTestCycle:", error.message);
    throw error;
  }
};

// Update an existing test cycle
export const updateTestCycle = async (testCycle: Partial<TestCycle> & { id: string }): Promise<TestCycle> => {
  try {
    const dbTestCycle = {
      id: testCycle.id,
      name: testCycle.name,
      description: testCycle.description,
      status: testCycle.status,
      start_date: testCycle.start_date,
      end_date: testCycle.end_date,
      environment: testCycle.environment,
      build_version: testCycle.build_version
    };
    
    // Use a more generic approach
    const result = await supabase.rpc('update_test_cycle', {
      cycle_data: dbTestCycle
    }) as any;
    
    if (result.error) {
      throw new Error(`Error updating test cycle: ${result.error.message}`);
    }
    
    if (!result.data) {
      throw new Error(`Test cycle not found: ${testCycle.id}`);
    }
    
    return await mapDbTestCycleToTestCycle(result.data as DbTestCycle);
  } catch (error: any) {
    console.error("Error in updateTestCycle:", error.message);
    throw error;
  }
};

// Delete a test cycle
export const deleteTestCycle = async (id: string): Promise<void> => {
  try {
    // Use a more generic approach
    const result = await supabase.rpc('delete_test_cycle', {
      p_cycle_id: id
    }) as any;
    
    if (result.error) {
      throw new Error(`Error deleting test cycle: ${result.error.message}`);
    }
  } catch (error: any) {
    console.error("Error in deleteTestCycle:", error.message);
    throw error;
  }
};
