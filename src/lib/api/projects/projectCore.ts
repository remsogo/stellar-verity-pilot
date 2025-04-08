
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';

/**
 * Retrieves all projects the current user has access to
 */
export async function getProjects(): Promise<Project[]> {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Use regular query to get projects the user has access to
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_users.user_id', user.id)
      .order('created_at', { ascending: false });
    
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
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user has access to this project first
    const { data: projectAccess, error: accessError } = await supabase
      .from('project_users')
      .select('*')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (accessError) throw accessError;
    
    if (!projectAccess) {
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
 * Creates a new project
 */
export async function createProject(name: string, description?: string): Promise<Project | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required to create a project');
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Project;
  } catch (error: any) {
    console.error('Error creating project:', error);
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
