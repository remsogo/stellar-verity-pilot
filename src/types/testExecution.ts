
import { TestCase } from './testCase';
import { Status } from './testCase';

export type TestExecution = {
  id: string;
  testCaseId: string;
  testCase: TestCase;
  executor: string;
  status: Status;
  startTime: string;
  endTime?: string;
  environment: string;
  buildVersion?: string;
  notes?: string;
  defects: string[];
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
  testCase?: any;
};
