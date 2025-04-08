
export type TestPlan = {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  test_cases: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type DbTestPlan = {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  status: string;
  test_cases: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
};
