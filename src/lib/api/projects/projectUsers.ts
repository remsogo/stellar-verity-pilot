
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole } from '@/integrations/supabase/project-types';

/**
 * Retrieves all users for a specific project
 */
export async function getProjectUsers(projectId: string) {
  try {
    // First get the project users
    const { data: projectUsers, error: projectUsersError } = await supabase
      .from('project_users')
      .select('id, user_id, role')
      .eq('project_id', projectId);
    
    if (projectUsersError) throw projectUsersError;
    
    if (!projectUsers || projectUsers.length === 0) {
      return [];
    }
    
    // Then get the user profiles separately
    const userIds = projectUsers.map(user => user.user_id);
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('auth_id, email, full_name')
      .in('auth_id', userIds);
    
    if (profilesError) throw profilesError;
    
    // Now combine the data
    const users = projectUsers.map(user => {
      const profile = userProfiles?.find(profile => profile.auth_id === user.user_id);
      return {
        id: user.id,
        user_id: user.user_id,
        email: profile?.email || '',
        full_name: profile?.full_name || null,
        role: user.role as ProjectRole
      };
    });
    
    return users;
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
    
    if (userError) throw userError;
    
    // If user profile not found, create a placeholder with the email
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
    const { data, error } = await supabase
      .from('project_users')
      .update({ role })
      .eq('project_id', projectId)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
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
    const { error } = await supabase
      .from('project_users')
      .delete()
      .eq('project_id', projectId)
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error removing user from project:', error);
    throw error;
  }
}
