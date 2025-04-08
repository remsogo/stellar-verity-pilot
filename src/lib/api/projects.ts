
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
    // This will be a raw SQL query or direct database access in a real app
    // Using a simplified approach here
    const { data, error } = await supabase.rpc('get_project_users', { 
      p_project_id: projectId 
    });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching project users:', error);
    throw error;
  }
}

export async function addUserToProject(projectId: string, email: string, role: string) {
  try {
    // In a real app, you would look up the user ID by email first
    // For simplicity, we're using the email as the user_id directly
    const userId = email;
    
    const { data, error } = await supabase.rpc('add_user_to_project', {
      p_project_id: projectId,
      p_user_id: userId,
      p_role: role
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error adding user to project:', error);
    throw error;
  }
}

export async function updateUserRole(projectId: string, userId: string, role: string) {
  try {
    const { data, error } = await supabase.rpc('update_user_role', {
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
    const { error } = await supabase.rpc('remove_user_from_project', {
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
