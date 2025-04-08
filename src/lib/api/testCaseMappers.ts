
import { DbTestCase, TestCase } from "@/types";

// Helper to convert DB model to frontend model
export const mapDbTestCaseToTestCase = (dbTestCase: DbTestCase): TestCase => {
  const testCase: TestCase = {
    id: dbTestCase.id,
    title: dbTestCase.title,
    description: dbTestCase.description,
    status: dbTestCase.status as any,
    priority: dbTestCase.priority as any,
    author: dbTestCase.author,
    project_id: dbTestCase.project_id,
    estimate_time: dbTestCase.estimate_time,
    automated: dbTestCase.automated,
    preconditions: dbTestCase.preconditions,
    requirements: dbTestCase.requirements,
    tags: dbTestCase.tags || [],
    createdAt: dbTestCase.created_at,
    updatedAt: dbTestCase.updated_at
  };

  if (dbTestCase.steps && dbTestCase.steps.length > 0) {
    testCase.steps = dbTestCase.steps.map(step => ({
      id: step.id,
      description: step.description,
      expectedResult: step.expected_result,
      testCaseId: step.test_case_id,
      order: step.step_order
    }));
  }

  return testCase;
};
