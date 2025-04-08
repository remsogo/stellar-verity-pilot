
// Réexportation des types depuis les fichiers modulaires
export * from './testCase';
export * from './testExecution';
export * from './testPlan';
export * from './testCycle';

// Types génériques ou partagés

// Type pour les defects
export type Defect = {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  severity: "low" | "medium" | "high" | "critical"; 
  reporter: string;
  assignee?: string;
  project_id: string;
  test_execution_id?: string;
  created_at: string;
  updated_at: string;
};

// Type pour les suites de test
export type TestSuite = {
  id: string;
  name: string;
  description: string;
  testCases: string[];
};

// Types pour le tableau de bord
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

// Types pour la traçabilité
export type Requirement = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'obsolete';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: string;
  created_at: string;
  updated_at: string;
};

export type RequirementCoverage = {
  requirement_id: string;
  test_case_ids: string[];
  coverage_percent: number;
};

// Types pour les folders et organisation hiérarchique
export type TestFolder = {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  items: (TestFolder | TestCase)[];
};
