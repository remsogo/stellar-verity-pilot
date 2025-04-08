
export type Status = 'passed' | 'failed' | 'pending' | 'blocked';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TestStep = {
  id: string;
  description: string;
  expectedResult: string;
  testCaseId: string;
  order: number;
};

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
  preconditions?: string;
  requirements?: string[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
  // These fields are for frontend use
  createdAt?: string;
  updatedAt?: string;
  steps?: TestStep[];
};

export type TestExecution = {
  id: string;
  testCaseId: string;
  testCase: TestCase;
  executor: string;
  status: Status;
  startTime: string;
  endTime?: string;
  environment: string;
  notes?: string;
  defects: string[];
};

export type TestSuite = {
  id: string;
  name: string;
  description: string;
  testCases: string[];
};

export type DashboardStat = {
  label: string;
  value: number;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
};

export type TestTrend = {
  date: string;
  passed: number;
  failed: number;
  pending: number;
  blocked: number;
};

export type ExecutionStep = {
  id: string;
  test_step_id: string;
  execution_id: string;
  status: Status;
  actual_result: string | null;
  step_order: number;
  description: string;
  expected_result: string;
};

// Database models that map directly to Supabase tables
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

export type DbTestExecution = {
  id: string;
  test_case_id: string;
  executor: string;
  status: string;
  start_time: string;
  end_time?: string;
  environment: string;
  notes?: string;
  defects?: string[];
  created_at: string;
  updated_at: string;
  test_suite_id?: string;
  build_version?: string;
  testCase?: DbTestCase;
};
