
// Custom type definitions to extend Supabase generated types
import { Database } from './types';

// Extend the Database interface to include our custom RPC functions
export interface CustomFunctions {
  get_user_projects: {
    Args: Record<string, never>;
    Returns: Database['public']['Tables']['projects']['Row'][];
  };
  is_member_of_project: {
    Args: { project_id: string };
    Returns: boolean;
  };
  get_project_users: {
    Args: { p_project_id: string };
    Returns: {
      id: string;
      user_id: string;
      email: string;
      full_name: string | null;
      role: string;
    }[];
  };
}

// This will be used to extend the Database type with our custom functions
export type DatabaseWithCustomFunctions = Database & {
  public: {
    Functions: Database['public']['Functions'] & CustomFunctions;
  };
};
