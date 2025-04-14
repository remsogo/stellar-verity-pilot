
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
 * In your schema, this should be projects where the user is the owner
 */
export async function getAllProjects(): Promise<Project[]> {
  // Get the current user ID
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // With the new schema, we need to query projects where the user is the owner
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId);
  
  if (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
  
  return data as Project[];
}
