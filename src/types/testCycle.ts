
import { TestPlan } from "./testPlan";

export type TestCycleStatus = 'planned' | 'active' | 'completed' | 'archived';

export interface TestCycle {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  test_plan_id: string;
  testPlan?: TestPlan;
  status: TestCycleStatus;
  start_date: string;
  end_date: string;
  environment: string;
  build_version?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  execution_progress?: {
    passed: number;
    failed: number;
    blocked: number;
    pending: number;
    total: number;
  };
}

export interface DbTestCycle {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  test_plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  environment: string;
  build_version?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
