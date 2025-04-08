
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole } from '@/integrations/supabase/project-types';

/**
 * Retrieves all users for a specific project
 */
export async function getProjectUsers(projectId: string) {
  try {
    // Build the URL with the query parameter
    const functionUrl = `get_project_users?project_id=${encodeURIComponent(projectId)}`;
    
    // Invoke the edge function with the URL
    const { data, error } = await supabase.functions.invoke(functionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (error) throw error;
    
    // If the data is undefined or not in the expected format, return an empty array
    return data?.data || [];
  } catch (error: any) {
    console.error('Error fetching project users:', error);
    throw error;
  }
}

/**
 * Adds a user to a project with a specific role
 */
export async function addUserToProject(projectId: string, email: string, role: ProjectRole) {
  try {
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('auth_id, email, full_name')
      .eq('email', email)
      .maybeSingle();
    
    const userId = userProfile?.auth_id || email;
    
    const { data, error } = await supabase
      .from('project_users')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const profileData = userProfile as { email?: string; full_name?: string } || {};
    
    return {
      id: data.id,
      user_id: data.user_id,
      email: profileData.email || email,
      full_name: profileData.full_name || null,
      role: data.role
    };
  } catch (error: any) {
    console.error('Error adding user to project:', error);
    throw error;
  }
}

/**
 * Updates a user's role in a project
 */
export async function updateUserRole(projectId: string, userId: string, role: ProjectRole) {
  try {
    const { data, error } = await supabase.functions.invoke('update_user_role', {
      method: 'POST',
      body: { 
        p_project_id: projectId, 
        p_user_id: userId, 
        p_role: role 
      }
    });
    
    if (error) throw error;
    
    return data?.data;
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Removes a user from a project
 */
export async function removeUserFromProject(projectId: string, userId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('remove_user_from_project', {
      method: 'POST',
      body: { 
        p_project_id: projectId, 
        p_user_id: userId
      }
    });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error removing user from project:', error);
    throw error;
  }
}
