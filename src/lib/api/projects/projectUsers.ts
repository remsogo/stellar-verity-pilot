
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole } from '@/integrations/supabase/project-types';
import { toast } from '@/components/ui/use-toast';
import { ProjectUser, ProjectWithMembers } from './projectModels';

interface ProjectUserData {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
}

/**
 * Retrieves all users for a specific project
 */
export async function getProjectUsers(projectId: string): Promise<ProjectUserData[]> {
  try {
    // Call the get_project_users function directly as an RPC
    // This leverages the security definer function to avoid the infinite recursion issue
    const { data, error } = await supabase.rpc('get_project_users', {
      p_project_id: projectId
    });
    
    if (error) {
      console.error('RPC error:', error);
      throw error;
    }
    
    return data as ProjectUserData[] || [];
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
      email: member.email,
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
    // First check if user exists in user_profiles
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('auth_id, email, full_name')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) throw userError;
    
    let userId;
    
    if (userProfile) {
      // If user exists, use their auth_id
      userId = userProfile.auth_id;
    } else {
      // For now, we'll store the email as a placeholder
      // In a real app, we would send an invitation email
      userId = email;
      
      toast({
        title: 'User not found',
        description: 'An invitation will be sent to this email address.',
      });
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
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      user_id: data.user_id,
      email: userProfile?.email || email,
      full_name: userProfile?.full_name || null,
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

/**
 * Check if a user is a member of a project
 */
export async function checkUserProjectMembership(projectId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('is_member_of_project', { project_id: projectId });
    
    if (error) throw error;
    
    return data || false;
  } catch (error: any) {
    console.error('Error checking project membership:', error);
    return false;
  }
}
