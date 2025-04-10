
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';
import { fixProjectUsersPolicy } from './fixPolicyUtils';

/**
 * Retrieves all projects the current user has access to
 */
export async function getProjects(): Promise<Project[]> {
  try {
    // Use the get_user_projects security definer function we created
    const { data, error } = await supabase
      .rpc('get_user_projects');
    
    if (error) throw error;
    return data as Project[] || [];
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    toast({
      title: 'Error fetching projects',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }
}

/**
 * Retrieves a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  try {
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
  } catch (error: any) {
    console.error('Error fetching project:', error);
    toast({
      title: 'Error fetching project',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
}

/**
 * Creates a new project and adds current user as an owner
 */
export async function createProject(name: string, description?: string): Promise<Project | null> {
  console.log('Starting project creation with:', { name, description });
  
  try {
    // Try the new bypass function first which avoids RLS issues entirely
    const { data: projectId, error: bypassError } = await supabase
      .rpc('create_project_bypass', { 
        p_name: name,
        p_description: description || null
      });
    
    if (bypassError) {
      console.error('Error in create_project_bypass:', bypassError);
      
      // If the bypass function fails, try the fix_project_users_policy and retry
      console.log('Attempting alternative project creation approach...');
      await fixProjectUsersPolicy();
    } else if (projectId) {
      console.log('Project created successfully with bypass function:', projectId);
      
      // Fetch the complete project details
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching new project:', fetchError);
        throw fetchError;
      }
      
      return projectData as Project;
    }
    
    // Fallback to direct insert only if bypass failed
    console.log('Using fallback direct insert approach');
    
    // Fallback direct insert
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{ 
        name, 
        description 
      }])
      .select()
      .single();
    
    if (projectError) {
      console.error('Error inserting project:', projectError);
      throw projectError;
    }
    
    if (!projectData) {
      console.error('No project data returned after insert');
      throw new Error('Failed to create project');
    }
    
    console.log('Project created successfully with fallback approach:', projectData);
    
    // The trigger should have automatically added the user as owner
    return projectData as Project;
    
  } catch (error: any) {
    console.error('Error in createProject flow:', error);
    throw error;
  }
}

/**
 * Updates an existing project
 */
export async function updateProject(id: string, updates: { name?: string; description?: string }): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Project;
  } catch (error: any) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Deletes a project by ID
 */
export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
