
// Types pour les test cases

// Type de base pour les étapes de test
export type TestStep = {
  id: string;
  description: string;
  expectedResult: string;
  testCaseId: string;
  order: number;
};

// Enum for status values (lowercase strings for consistency)
export enum TestCaseStatus {
  PASSED = "passed",
  FAILED = "failed",
  PENDING = "pending",
  BLOCKED = "blocked",
  READY = "ready",
  DRAFT = "draft"
}

// Enum for priority values (lowercase strings for consistency)
export enum TestCasePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

// Using literal types to ensure type compatibility
export type Status = "passed" | "failed" | "pending" | "blocked" | "ready" | "draft";
export type Priority = "low" | "medium" | "high" | "critical";

// Tag interface to support categorization
export interface TestTag {
  id: string;
  name: string;
  color?: string;
  category?: string;
}

// Collection interface for dynamic organization
export interface TestCollection {
  id: string;
  name: string;
  description?: string;
  isSmartCollection: boolean;
  criteria?: Record<string, any>; // For smart collections
  testCaseIds: string[];
  project_id: string;
  created_at?: string;
  updated_at?: string;
}

// TestParameter type for variable-based tests
export type TestParameter = {
  name: string;
  description?: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  defaultValue?: any;
};

// TestData type for data-driven tests
export type TestDataSet = {
  id: string;
  name: string;
  values: Record<string, any>;
};

// Complete TestCase type with tags for organization
export type TestCase = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  author: string;
  project_id: string;
  estimate_time?: number;
  automated?: boolean;
  data_driven?: boolean;
  test_data?: TestDataSet[];
  parameters?: TestParameter[];
  preconditions?: string;
  requirements?: string[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  steps?: TestStep[];
  // New fields for parent-child relationship
  is_parent?: boolean;
  parent_id?: string | null;
  child_test_cases?: TestCase[]; // Not stored in DB, used for UI representation
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
  data_driven?: boolean;
  test_data?: any; // Use 'any' for maximum compatibility with JSON data
  parameters?: any; // For storing parameters in the database
  preconditions?: string;
  requirements?: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  steps?: DbTestStep[];
  // New fields for parent-child relationship
  is_parent?: boolean;
  parent_id?: string | null;
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
  
  switch (normalizedStatus) {
    case "passed": return "passed";
    case "failed": return "failed";
    case "pending": return "pending";
    case "blocked": return "blocked";
    case "ready": return "ready";
    case "draft": return "draft";
    default: return "pending";
  }
};

// Utility function to normalize priority values
export const normalizePriority = (priority: string): Priority => {
  const normalizedPriority = priority.toLowerCase();
  
  switch (normalizedPriority) {
    case "low": return "low";
    case "medium": return "medium";
    case "high": return "high";
    case "critical": return "critical";
    default: return "medium";
  }
};
