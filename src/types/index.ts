
export type Status = 'passed' | 'failed' | 'pending' | 'blocked';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TestCase = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  author: string;
  createdAt: string;
  updatedAt: string;
  steps: TestStep[];
  tags: string[];
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
