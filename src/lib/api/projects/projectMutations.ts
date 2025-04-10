
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';
import { fixProjectUsersPolicy } from './fixPolicyUtils';

/**
 * Creates a new project using the secure bypass function
 */
export async function createNewProject(name: string, description?: string): Promise<Project | null> {
  try {
    // First check if a project with this name already exists
    // Only use direct equals comparison to avoid false positives
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('name', name);
    
    if (checkError) {
      console.error('Error checking for existing project:', checkError);
      if (checkError.message && checkError.message.includes('recursion')) {
        console.log('Recursion error detected, proceeding with project creation attempt anyway');
        // Continue despite the error since this might be a false positive due to RLS recursion
      } else {
        throw checkError;
      }
    } else if (existingProjects && existingProjects.length > 0) {
      console.log('Found existing projects with the same name:', existingProjects);
      // Double check the exact match to avoid case sensitivity issues
      const exactMatch = existingProjects.find(p => p.name === name);
      if (exactMatch) {
        throw new Error('A project with this name already exists');
      }
    }
    
    console.log('No duplicate project found, proceeding with creation');
    
    // Always use the create_project_bypass function which handles both 
    // project creation and user assignment in a single transaction
    const { data: projectId, error } = await supabase
      .rpc('create_project_bypass', { 
        p_name: name,
        p_description: description || null
      });
    
    if (error) {
      console.error('Error in create_project_bypass:', error);
      
      // Check if the error is a duplicate key error for the project itself
      if (error.message && error.message.includes('duplicate key') && 
          error.message.includes('projects_name_key')) {
        throw new Error('A project with this name already exists');
      }
      
      throw error;
    }
    
    console.log('Project created successfully with ID:', projectId);
    
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
    
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Try policy fix as a last resort if we see recursion errors
    if (error.message && error.message.includes('recursion')) {
      try {
        console.log('Attempting policy fix as fallback...');
        await fixProjectUsersPolicy();
        
        // Try again with the bypass function after fixing policies
        console.log('Retrying project creation after policy fix...');
        const { data: projectId, error: retryError } = await supabase
          .rpc('create_project_bypass', { 
            p_name: name,
            p_description: description || null
          });
          
        if (retryError) throw retryError;
        
        // Fetch the project details
        const { data: projectData, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (fetchError) throw fetchError;
        return projectData as Project;
      } catch (fallbackError: any) {
        console.error('Fallback attempt also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
    
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
