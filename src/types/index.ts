
export type Status = 'passed' | 'failed' | 'pending' | 'blocked';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Updated to match database schema
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

export type TestStep = {
  id: string;
  description: string;
  expectedResult: string;
  testCaseId: string;
  order: number;
};

export type TestExecution = {
  id: string;
  testCaseId: string;
  testCase: TestCase;
  executor: string;
  status: Status;
  startTime: string;
  endTime: string;
  environment: string;
  notes: string;
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
