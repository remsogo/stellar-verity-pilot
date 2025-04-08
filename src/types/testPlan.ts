
import { TestCase } from ".";

export type TestPlanStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface TestPlan {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  status: TestPlanStatus;
  test_cases: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbTestPlan {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  status: string;
  test_cases: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}
