
import { supabase } from "@/integrations/supabase/client";
import { Requirement, RequirementCoverage } from "@/types";

// Get all requirements for a project
export const getRequirements = async (projectId: string): Promise<Requirement[]> => {
  const { data, error } = await supabase
    .from("requirements")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching requirements: ${error.message}`);
  }

  return data as Requirement[];
};

// Get a single requirement by ID
export const getRequirement = async (id: string): Promise<Requirement> => {
  const { data, error } = await supabase
    .from("requirements")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching requirement: ${error.message}`);
  }

  return data as Requirement;
};

// Create a new requirement
export const createRequirement = async (requirement: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>): Promise<Requirement> => {
  const { data, error } = await supabase
    .from("requirements")
    .insert([requirement])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating requirement: ${error.message}`);
  }

  return data as Requirement;
};

// Update an existing requirement
export const updateRequirement = async (requirement: Partial<Requirement> & { id: string }): Promise<Requirement> => {
  const { data, error } = await supabase
    .from("requirements")
    .update(requirement)
    .eq("id", requirement.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating requirement: ${error.message}`);
  }

  return data as Requirement;
};

// Delete a requirement
export const deleteRequirement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("requirements")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting requirement: ${error.message}`);
  }
};

// Get coverage metrics for a specific requirement
export const getRequirementCoverage = async (requirementId: string): Promise<RequirementCoverage> => {
  // Get test cases linked to this requirement
  const { data, error } = await supabase
    .from("test_cases")
    .select("id")
    .contains("requirements", [requirementId]);

  if (error) {
    throw new Error(`Error fetching requirement coverage: ${error.message}`);
  }

  const testCaseIds = data.map(tc => tc.id);
  const coveragePercent = testCaseIds.length > 0 ? 100 : 0; // Simple calculation; can be enhanced

  return {
    requirement_id: requirementId,
    test_case_ids: testCaseIds,
    coverage_percent: coveragePercent
  };
};

// Link a test case to a requirement
export const linkTestCaseToRequirement = async (testCaseId: string, requirementId: string): Promise<void> => {
  // First get the test case to access its current requirements
  const { data: testCase, error: fetchError } = await supabase
    .from("test_cases")
    .select("requirements")
    .eq("id", testCaseId)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching test case: ${fetchError.message}`);
  }

  // Add the requirement ID to the requirements array if it's not already there
  const requirements = testCase.requirements || [];
  if (!requirements.includes(requirementId)) {
    requirements.push(requirementId);
    
    // Update the test case with the new requirements array
    const { error: updateError } = await supabase
      .from("test_cases")
      .update({ requirements })
      .eq("id", testCaseId);

    if (updateError) {
      throw new Error(`Error linking test case to requirement: ${updateError.message}`);
    }
  }
};

// Unlink a test case from a requirement
export const unlinkTestCaseFromRequirement = async (testCaseId: string, requirementId: string): Promise<void> => {
  // First get the test case to access its current requirements
  const { data: testCase, error: fetchError } = await supabase
    .from("test_cases")
    .select("requirements")
    .eq("id", testCaseId)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching test case: ${fetchError.message}`);
  }

  // Remove the requirement ID from the requirements array
  const requirements = testCase.requirements || [];
  const updatedRequirements = requirements.filter(id => id !== requirementId);
  
  // Update the test case with the new requirements array
  const { error: updateError } = await supabase
    .from("test_cases")
    .update({ requirements: updatedRequirements })
    .eq("id", testCaseId);

  if (updateError) {
    throw new Error(`Error unlinking test case from requirement: ${updateError.message}`);
  }
};
