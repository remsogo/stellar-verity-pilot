
// Types pour les test cases

// Type de base pour les étapes de test
export type TestStep = {
  id: string;
  description: string;
  expectedResult: string;
  testCaseId: string;
  order: number;
};

// Base type without circular references
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

// Type principal with children reference as string[] to avoid circular reference
export type TestCase = BaseTestCase & {
  // Store just the IDs of children to avoid circular reference
  children: string[];
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

// Status et Priority
export type Status = 'passed' | 'failed' | 'pending' | 'blocked' | 'ready' | 'draft' | 'blocked';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Assurons-nous que les statuts correspondent à ceux utilisés dans l'application
export const normalizeStatus = (status: string): Status => {
  // Mise en forme du statut pour être conforme au type Status
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'ready' || 
      normalizedStatus === 'draft' || 
      normalizedStatus === 'blocked' ||
      normalizedStatus === 'passed' ||
      normalizedStatus === 'failed' ||
      normalizedStatus === 'pending') {
    return normalizedStatus as Status;
  }
  
  // Statut par défaut si non reconnu
  return 'pending';
};
