
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

/**
 * Creates a new project and adds current user as owner in project_users
 */
export async function createNewProject(name: string, description?: string): Promise<Project | null> {
  try {
    // First check if a project with this name already exists
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('name', name);
    
    if (checkError) {
      console.error('Error checking for existing project:', checkError);
      throw checkError;
    }
    
    if (existingProjects && existingProjects.length > 0) {
      console.log('Found existing projects with the same name:', existingProjects);
      // Double check the exact match to avoid case sensitivity issues
      const exactMatch = existingProjects.find(p => p.name === name);
      if (exactMatch) {
        throw new Error('A project with this name already exists');
      }
    }
    
    console.log('No duplicate project found, proceeding with creation');
    
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Insert the project
    const { data, error } = await supabase
      .from('projects')
      .insert({ 
        name, 
        description
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      
      // Check if the error is a duplicate key error
      if (error.message && (
          error.message.includes('duplicate key') || 
          error.message.includes('unique constraint')
      )) {
        throw new Error('A project with this name already exists');
      }
      
      throw error;
    }
    
    console.log('Project created successfully with ID:', data.id);
    
    // Add the current user to project_users as owner
    await supabase
      .from('project_users')
      .insert({
        project_id: data.id,
        user_id: userData.user.id,
        role: 'owner'
      });
    
    return data as Project;
  } catch (error: any) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Updates an existing project's details
 */
export async function updateProjectDetails(
  id: string, 
  updates: { name?: string; description?: string }
): Promise<Project | null> {
  // If trying to update the name, first check if it's a duplicate
  if (updates.name) {
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('name', updates.name)
      .neq('id', id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for existing project:', checkError);
    }
    
    if (existingProject) {
      throw new Error('A project with this name already exists');
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data as Project;
}

/**
 * Removes a project by ID
 */
export async function removeProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  return true;
}
