
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

// Simple reference type for children to avoid circular references
export type TestCaseReference = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
};

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

// Complete TestCase type with proper children array that won't cause circular references
export type TestCase = BaseTestCase & {
  // Using TestCaseReference type for children to avoid circular references
  children?: TestCaseReference[];
  // For storing children IDs separately to avoid circular references
  children_ids?: string[];
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
