
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole } from '@/integrations/supabase/project-types';
import { toast } from '@/components/ui/use-toast';
import { ProjectUser, ProjectWithMembers } from './projectModels';

/**
 * Retrieves all users for a specific project
 */
export async function getProjectUsers(projectId: string): Promise<any[]> {
  try {
    // Updated query to match the schema structure
    const { data, error } = await supabase
      .from('project_users')
      .select(`
        id,
        project_id,
        user_id,
        role,
        user_profiles:user_profiles(user_id, full_name, email)
      `)
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching project users:', error);
      throw error;
    }
    
    console.log('Raw project users data:', data);
    
    // Format the data to match the expected structure
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      email: item.user_profiles?.email || '',
      full_name: item.user_profiles?.full_name || null,
      role: item.role
    }));
  } catch (error: any) {
    console.error('Error fetching project users:', error);
    throw error;
  }
}

/**
 * Get a project with its members
 */
export async function getProjectWithMembers(projectId: string): Promise<ProjectWithMembers | null> {
  try {
    // Get the project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) throw projectError;
    
    // Get the project members
    const members = await getProjectUsers(projectId);
    
    // Map the members to the expected format
    const formattedMembers = members.map(member => ({
      id: member.id,
      email: member.email || '',
      name: member.full_name || undefined,
      role: member.role as ProjectRole
    }));
    
    // Return the project with members
    return {
      ...project,
      members: formattedMembers
    } as ProjectWithMembers;
  } catch (error: any) {
    console.error('Error fetching project with members:', error);
    toast({
      title: 'Error fetching project details',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
}

/**
 * Adds a user to a project with a specific role
 */
export async function addUserToProject(projectId: string, email: string, role: ProjectRole) {
  try {
    // First check if user exists in user_profiles by their email
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id, full_name')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) throw userError;
    
    let userId;
    
    if (userProfile) {
      // If user exists, use their user_id
      userId = userProfile.user_id;
    } else {
      // User doesn't exist, create an invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('project_invitations')
        .insert({
          project_id: projectId,
          invited_email: email,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          token: Math.random().toString(36).substring(2, 15),
          status: 'pending'
        })
        .select()
        .single();
      
      if (inviteError) throw inviteError;
      
      toast({
        title: 'User not found',
        description: 'An invitation will be sent to this email address.',
      });
      
      // Return a placeholder
      return {
        id: invitation.id,
        user_id: null,
        email: email,
        full_name: null,
        role: role
      };
    }
    
    // Add user to project
    const { data, error } = await supabase
      .from('project_users')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      id: userId,
      user_id: userId,
      email: email,
      full_name: userProfile?.full_name || null,
      role: role
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
      .eq('user_id', userId)
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
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error removing user from project:', error);
    throw error;
  }
}

/**
 * Check if a user is a member of a project
 */
export async function checkUserProjectMembership(projectId: string): Promise<boolean> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    
    if (!userId) {
      return false;
    }
    
    // Check if the user is in the project_users table
    const { data, error } = await supabase
      .from('project_users')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error: any) {
    console.error('Error checking project membership:', error);
    return false;
  }
}
