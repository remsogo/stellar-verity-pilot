
// Types pour les test cases

// Type de base pour les étapes de test
export type TestStep = {
  id: string;
  description: string;
  expectedResult: string;
  testCaseId: string;
  order: number;
};

// Enum for status values to ensure consistency
export enum TestCaseStatus {
  PASSED = "passed",
  FAILED = "failed",
  PENDING = "pending",
  BLOCKED = "blocked",
  READY = "ready",
  DRAFT = "draft"
}

// Enum for priority values
export enum TestCasePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

// Status et Priority types based on enums
export type Status = keyof typeof TestCaseStatus;
export type Priority = keyof typeof TestCasePriority;

// Base test case type without children relationship
export interface BaseTestCase {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
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
  createdAt?: string;
  updatedAt?: string;
  steps?: TestStep[];
}

// Complete TestCase type with optional children array
export type TestCase = BaseTestCase & {
  // Children are stored as string IDs to prevent circular reference
  children?: string[];
};

// Type pour la base de données
export type DbTestCase = {
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
  created_at: string;
  updated_at: string;
  is_parent?: boolean;
  parent_id?: string | null;
  steps?: DbTestStep[];
};

export type DbTestStep = {
  id: string;
  description: string;
  expected_result: string;
  test_case_id: string;
  step_order: number;
  created_at: string;
  updated_at: string;
};

// Utility function to normalize status values
export const normalizeStatus = (status: string): Status => {
  const normalizedStatus = status.toLowerCase();
  
  switch(normalizedStatus) {
    case "ready":
    case "draft":
    case "blocked":
    case "passed":
    case "failed":
    case "pending":
      return normalizedStatus as Status;
    default:
      return "pending"; // Default status
  }
};

// Utility function to normalize priority values
export const normalizePriority = (priority: string): Priority => {
  const normalizedPriority = priority.toLowerCase();
  
  switch(normalizedPriority) {
    case "low":
    case "medium":
    case "high":
    case "critical":
      return normalizedPriority as Priority;
    default:
      return "medium"; // Default priority
  }
};
