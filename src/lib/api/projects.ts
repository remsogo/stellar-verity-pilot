import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProjectRole } from '@/integrations/supabase/project-types';

export async function getProjects() {
  try {
    // This will only return projects the user has access to thanks to RLS
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
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

export async function getProject(id: string) {
  try {
    // This will only return the project if the user has access to it
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
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

export async function createProject(name: string, description?: string) {
  try {
    // Get the current authenticated user's session
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
    
    return data;
  } catch (error: any) {
    console.error('Error creating project:', error);
    throw error; // We rethrow to let the component handle the error
  }
}

export async function updateProject(id: string, updates: { name?: string; description?: string }) {
  try {
    // RLS policies will ensure the user has permission to update this project
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error updating project:', error);
    throw error; // We rethrow to let the component handle the error
  }
}

export async function deleteProject(id: string) {
  try {
    // RLS policies will ensure the user has permission to delete this project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw error; // We rethrow to let the component handle the error
  }
}

export async function getProjectUsers(projectId: string) {
  try {
    // Use a direct RPC call to the security definer function to avoid RLS recursion
    const { data, error } = await supabase
      .rpc('get_project_users', { p_project_id: projectId });
    
    if (error) throw error;
    
    // Format the response to a consistent structure
    if (Array.isArray(data)) {
      return data.map(item => {
        return {
          id: item.id,
          user_id: item.user_id,
          email: item.email || item.user_id.toString(),
          full_name: item.full_name || null,
          role: item.role
        };
      });
    }
    
    return [];
  } catch (error: any) {
    console.error('Error fetching project users:', error);
    throw error;
  }
}

export async function addUserToProject(projectId: string, email: string, role: ProjectRole) {
  try {
    // First find the user by email to get their ID
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('auth_id, email, full_name')
      .eq('email', email)
      .maybeSingle();
    
    // If user doesn't exist by email, use the email as ID (it will be resolved when they sign up)
    const userId = userProfile?.auth_id || email;
    
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
    
    // Safely extract user profile data with type assertions
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

export async function updateUserRole(projectId: string, userId: string, role: ProjectRole) {
  try {
    // Use RPC to call the security definer function
    const { data, error } = await supabase
      .rpc('update_user_role', { 
        p_project_id: projectId, 
        p_user_id: userId, 
        p_role: role 
      });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

export async function removeUserFromProject(projectId: string, userId: string) {
  try {
    // Use RPC to call the security definer function
    const { data, error } = await supabase
      .rpc('remove_user_from_project', { 
        p_project_id: projectId, 
        p_user_id: userId 
      });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error removing user from project:', error);
    throw error;
  }
}
