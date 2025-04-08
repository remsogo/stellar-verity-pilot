
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
  
  // Try to get execution stats using the function we created
  try {
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_test_cycle_stats', {
        p_cycle_id: dbTestCycle.id
      });
    
    if (statsData && !statsError) {
      // Process the stats
      const stats = statsData as any;
      progress = {
        passed: stats.passed || 0,
        failed: stats.failed || 0,
        blocked: stats.blocked || 0,
        pending: stats.pending || 0,
        total: stats.total || testPlan.test_cases.length
      };
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
    const { data, error } = await supabase.rpc('get_project_test_cycles', {
      p_project_id: projectId
    });
    
    if (error) {
      throw new Error(`Error fetching test cycles: ${error.message}`);
    }
    
    const cycles: TestCycle[] = [];
    if (data) {
      for (const cycle of data as DbTestCycle[]) {
        cycles.push(await mapDbTestCycleToTestCycle(cycle));
      }
    }
    
    return cycles;
  } catch (error: any) {
    console.error("Error in getTestCycles:", error.message);
    return [];
  }
};

// Get a single test cycle by ID
export const getTestCycle = async (id: string): Promise<TestCycle> => {
  try {
    const { data, error } = await supabase.rpc('get_test_cycle_by_id', {
      p_cycle_id: id
    });
    
    if (error) {
      throw new Error(`Error fetching test cycle: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Test cycle not found: ${id}`);
    }
    
    return await mapDbTestCycleToTestCycle(data[0] as DbTestCycle);
  } catch (error: any) {
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
    
    const { data, error } = await supabase.rpc('create_test_cycle', {
      cycle_data: dbTestCycle
    });
    
    if (error) {
      throw new Error(`Error creating test cycle: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Failed to create test cycle');
    }
    
    return await mapDbTestCycleToTestCycle(data as DbTestCycle);
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
    
    const { data, error } = await supabase.rpc('update_test_cycle', {
      cycle_data: dbTestCycle
    });
    
    if (error) {
      throw new Error(`Error updating test cycle: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Test cycle not found: ${testCycle.id}`);
    }
    
    return await mapDbTestCycleToTestCycle(data as DbTestCycle);
  } catch (error: any) {
    console.error("Error in updateTestCycle:", error.message);
    throw error;
  }
};

// Delete a test cycle
export const deleteTestCycle = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('delete_test_cycle', {
      p_cycle_id: id
    });
    
    if (error) {
      throw new Error(`Error deleting test cycle: ${error.message}`);
    }
  } catch (error: any) {
    console.error("Error in deleteTestCycle:", error.message);
    throw error;
  }
};
