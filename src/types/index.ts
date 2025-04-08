
// Réexportation des types depuis les fichiers modulaires
export * from './testCase';
export * from './testExecution';
export * from './testPlan';

// Types génériques ou partagés

// Type pour les defects
export type Defect = {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  severity: Priority;
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

// Réimportation pour avoir accès au type Priority
import { Priority } from './testCase';
