
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

/**
 * Retrieves a single project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project by id:', error);
    throw error;
  }
  
  return data as Project;
}

/**
 * Retrieves all projects the current user has access to
 * Based on the schema, this means projects where:
 * 1. The user is in the project_users table
 */
export async function getAllProjects(): Promise<Project[]> {
  // Get the current user ID
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get projects where the user has an entry in project_users
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', supabase.rpc('get_user_projects'));
  
  if (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
  
  return data as Project[];
}
