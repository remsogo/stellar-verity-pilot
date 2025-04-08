
import { DbTestCase, DbTestStep, TestCase, TestStep } from "@/types";

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
    status: dbTestCase.status as any, // Conversion du statut
    priority: dbTestCase.priority as any, // Conversion de la priorité
    author: dbTestCase.author,
    project_id: dbTestCase.project_id,
    estimate_time: dbTestCase.estimate_time,
    automated: dbTestCase.automated,
    preconditions: dbTestCase.preconditions,
    requirements: dbTestCase.requirements,
    tags: dbTestCase.tags,
    is_parent: dbTestCase.is_parent,
    parent_id: dbTestCase.parent_id,
    created_at: dbTestCase.created_at,
    updated_at: dbTestCase.updated_at,
    // Conversion des étapes de test si elles existent
    steps: dbTestCase.steps ? dbTestCase.steps.map(mapDbTestStepToTestStep) : undefined,
    // Initialize children as empty array by default
    children: [],
  };
};
