
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';

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
    // Check if user is a member of the project first
    const { data: hasAccess, error: accessError } = await supabase
      .rpc('is_member_of_project', { project_id: id });
    
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
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required to create a project');
    }
    
    // First insert the project record
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{ name, description }])
      .select()
      .single();
    
    if (projectError) {
      throw projectError;
    }
    
    if (!projectData) {
      throw new Error('Failed to create project');
    }
    
    // Now use our custom function to add the owner
    const { error: ownerError } = await supabase
      .rpc('add_project_owner', { 
        project_id: projectData.id,
        owner_id: session.user.id 
      });
    
    if (ownerError) {
      // Clean up if adding the owner failed
      console.error('Failed to add project owner:', ownerError);
      await supabase.from('projects').delete().eq('id', projectData.id);
      throw ownerError;
    }
    
    return projectData as Project;
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
