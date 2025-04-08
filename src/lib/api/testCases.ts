
import { supabase } from "@/integrations/supabase/client";
import { DbTestCase, TestCase } from "@/types";
import { mapDbTestCaseToTestCase } from "./testCaseMappers";

export const getTestCase = async (id: string): Promise<TestCase> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching test case: ${error.message}`);
  }

  // Utilisation d'une assertion de type sans unknown
  const dbTestCase = data as DbTestCase;
  return mapDbTestCaseToTestCase(dbTestCase);
};

export const getChildTestCases = async (parentId: string): Promise<TestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*, steps:test_steps(*)")
    .eq("parent_id", parentId);

  if (error) {
    throw new Error(`Error fetching child test cases: ${error.message}`);
  }

  // Utilisez une assertion de type directe sans chaîne
  const dbTestCases = data as DbTestCase[];
  return dbTestCases.map(mapDbTestCaseToTestCase);
};

export const updateTestCase = async (testCase: Partial<TestCase> & { id: string }): Promise<TestCase> => {
  // Convert frontend model to DB model for update
  const dbTestCase: Partial<DbTestCase> = {
    id: testCase.id,
    title: testCase.title,
    description: testCase.description,
    status: testCase.status,
    priority: testCase.priority,
    automated: testCase.automated,
    estimate_time: testCase.estimate_time,
    preconditions: testCase.preconditions,
    requirements: testCase.requirements,
    tags: testCase.tags,
    is_parent: testCase.is_parent,
    parent_id: testCase.parent_id
  };

  const { data, error } = await supabase
    .from("test_cases")
    .update(dbTestCase)
    .eq("id", testCase.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating test case: ${error.message}`);
  }

  return mapDbTestCaseToTestCase(data as DbTestCase);
};

export const createTestCase = async (testCase: Partial<TestCase>): Promise<TestCase> => {
  // Convert frontend model to DB model for creation
  const dbTestCase = {
    title: testCase.title || "New Test Case",
    description: testCase.description,
    status: testCase.status || "pending",
    priority: testCase.priority || "medium",
    author: testCase.author,
    project_id: testCase.project_id,
    estimate_time: testCase.estimate_time,
    automated: testCase.automated || false,
    preconditions: testCase.preconditions,
    requirements: testCase.requirements,
    tags: testCase.tags || [],
    is_parent: testCase.is_parent || false,
    parent_id: testCase.parent_id
  };

  const { data, error } = await supabase
    .from("test_cases")
    .insert(dbTestCase)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test case: ${error.message}`);
  }

  return mapDbTestCaseToTestCase(data as DbTestCase);
};
