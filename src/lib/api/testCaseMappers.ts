
import { DbTestCase, DbTestStep, TestCase, TestStep, normalizeStatus, normalizePriority } from "@/types";

/**
 * Convertit un DbTestStep en TestStep
 */
export const mapDbTestStepToTestStep = (dbStep: DbTestStep): TestStep => {
  return {
    id: dbStep.id,
    description: dbStep.description,
    expectedResult: dbStep.expected_result,
    testCaseId: dbStep.test_case_id,
    order: dbStep.step_order,
  };
};

/**
 * Convertit un DbTestCase en TestCase
 */
export const mapDbTestCaseToTestCase = (dbTestCase: DbTestCase): TestCase => {
  return {
    id: dbTestCase.id,
    title: dbTestCase.title,
    description: dbTestCase.description,
    status: normalizeStatus(dbTestCase.status),
    priority: normalizePriority(dbTestCase.priority),
    author: dbTestCase.author,
    project_id: dbTestCase.project_id,
    estimate_time: dbTestCase.estimate_time,
    automated: dbTestCase.automated,
    data_driven: dbTestCase.data_driven,
    test_data: dbTestCase.test_data && typeof dbTestCase.test_data === 'object' 
      ? Array.isArray(dbTestCase.test_data) 
        ? dbTestCase.test_data 
        : Object.keys(dbTestCase.test_data).length > 0 
          ? [dbTestCase.test_data] 
          : undefined
      : undefined,
    parameters: dbTestCase.parameters && typeof dbTestCase.parameters === 'object'
      ? Array.isArray(dbTestCase.parameters)
        ? dbTestCase.parameters
        : Object.keys(dbTestCase.parameters).length > 0
          ? [dbTestCase.parameters]
          : undefined
      : undefined,
    preconditions: dbTestCase.preconditions,
    requirements: dbTestCase.requirements,
    tags: dbTestCase.tags,
    created_at: dbTestCase.created_at,
    updated_at: dbTestCase.updated_at,
    // Map steps if they exist
    steps: dbTestCase.steps ? dbTestCase.steps.map(mapDbTestStepToTestStep) : undefined,
  };
};

/**
 * Extracts parameter names from text by finding words that start with $
 * @param text The text containing parameters
 * @returns Array of parameter names without the $ prefix
 */
export const extractParametersFromText = (text: string): string[] => {
  if (!text) return [];
  
  const paramRegex = /\$([a-zA-Z0-9_]+)/g;
  const matches = text.match(paramRegex);
  
  if (!matches) return [];
  
  // Remove $ prefix and return unique parameter names
  return [...new Set(matches.map(match => match.substring(1)))];
};
