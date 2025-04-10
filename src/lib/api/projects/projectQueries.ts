
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

/**
 * Retrieves all projects for the current user using the security definer function
 */
export async function getAllProjects(): Promise<Project[]> {
  // Use the get_user_projects security definer function we created
  const { data, error } = await supabase
    .rpc('get_user_projects');
  
  if (error) throw error;
  return data as Project[] || [];
}

/**
 * Retrieves a single project by ID with security checks
 */
export async function getProjectById(id: string): Promise<Project | null> {
  // Check if user is a member of the project first using our secure function
  const { data: hasAccess, error: accessError } = await supabase
    .rpc('is_project_member_secure', { p_project_id: id });
  
  if (accessError) throw accessError;
  
  if (!hasAccess) {
    throw new Error('You do not have access to this project');
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Project;
}
