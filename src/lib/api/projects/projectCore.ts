
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
    // First try to fix any policy issues to avoid recursion
    await fixProjectUsersPolicy();
    
    // Get current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting current user:', userError);
      throw userError;
    }
    
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('Authentication required to create a project');
    }
    
    console.log('Authenticated user:', user.id);
    
    // Try a direct approach using admin_query to bypass RLS
    try {
      // Use admin_query to create the project
      const insertSQL = `
        INSERT INTO projects(name, description) 
        VALUES('${name.replace(/'/g, "''")}', ${description ? `'${description.replace(/'/g, "''")}'` : 'NULL'})
        RETURNING id, name, description, created_at, updated_at;
      `;
      
      // Get the inserted project data
      const { data: queryResult, error: queryError } = await supabase.rpc('admin_query_with_return', {
        query_text: insertSQL
      });
      
      if (queryError) {
        console.error('Error in admin_query insert:', queryError);
        throw queryError;
      }
      
      // Parse the returned JSON result
      let projectData;
      try {
        // The result should be a JSON string array with one object
        projectData = queryResult ? JSON.parse(queryResult)[0] : null;
      } catch (parseError) {
        console.error('Error parsing project data:', parseError, queryResult);
        throw new Error('Failed to parse project data after creation');
      }
      
      if (!projectData || !projectData.id) {
        throw new Error('No project data returned after creation');
      }
      
      console.log('Project created successfully with admin_query:', projectData);
      
      // Now add the user as owner using add_project_owner
      const { error: ownerError } = await supabase
        .rpc('add_project_owner', { 
          project_id: projectData.id,
          owner_id: user.id 
        });
      
      if (ownerError) {
        console.error('Error adding project owner:', ownerError);
        throw ownerError;
      }
      
      return projectData as Project;
    } catch (directError: any) {
      console.error('Direct admin_query approach failed:', directError);
      // Fall back to the original method if direct approach fails
    }
    
    // Step 1: Insert the project using regular method
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
      
      // If we get a recursion error, try to fix it and retry
      if (projectError.code === '42P17' && projectError.message.includes('recursion')) {
        console.log('Detected recursion error, attempting policy fix...');
        const fixed = await fixProjectUsersPolicy();
        
        if (fixed) {
          console.log('Policy fixed, retrying project creation...');
          // Retry the insert after fixing
          const { data: retryData, error: retryError } = await supabase
            .from('projects')
            .insert([{ name, description }])
            .select()
            .single();
            
          if (retryError) {
            console.error('Error in retry insert:', retryError);
            throw retryError;
          }
          
          if (!retryData) {
            throw new Error('No project data returned after retry');
          }
          
          console.log('Project created successfully on retry:', retryData);
          return retryData as Project;
        }
      }
      
      throw projectError;
    }
    
    if (!projectData) {
      console.error('No project data returned after insert');
      throw new Error('Failed to create project');
    }
    
    console.log('Project created successfully:', projectData);
    
    // Explicitly add the current user as project owner
    try {
      // Check if we were already added as owner via trigger
      const { data: existingOwner, error: checkError } = await supabase
        .rpc('is_project_member_secure', { 
          p_project_id: projectData.id
        });
      
      if (checkError) {
        console.error('Error checking project membership:', checkError);
      }
      
      // If we're not already an owner, add explicitly
      if (!existingOwner) {
        console.log('Explicitly adding owner to project:', projectData.id);
        const { error: ownerError } = await supabase
          .rpc('add_project_owner', { 
            project_id: projectData.id,
            owner_id: user.id 
          });
        
        if (ownerError) {
          console.error('Error adding project owner:', ownerError);
          throw ownerError;
        }
        
        console.log('Owner added successfully to project:', projectData.id);
      } else {
        console.log('User already added as project member by trigger');
      }
    } catch (ownerError: any) {
      console.error('Error in add_project_owner RPC call:', ownerError);
      
      // Cleanup: Delete the project if we couldn't add the owner
      try {
        console.log('Attempting to clean up project:', projectData.id);
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectData.id);
        
        if (deleteError) {
          console.error('Error cleaning up project after owner addition failed:', deleteError);
        } else {
          console.log('Project cleaned up after owner addition failed');
        }
      } catch (cleanupError) {
        console.error('Exception during project cleanup:', cleanupError);
      }
      
      throw new Error(`Failed to add you as project owner: ${ownerError.message}`);
    }
    
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
