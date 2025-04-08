import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProjectRole } from '@/integrations/supabase/project-types';

export async function getProjects() {
  try {
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
    throw error;
  }
}

export async function updateProject(id: string, updates: { name?: string; description?: string }) {
  try {
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
    throw error;
  }
}

export async function deleteProject(id: string) {
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

export async function getProjectUsers(projectId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('get_project_users', {
      method: 'GET',
      query: { p_project_id: projectId }
    });
    
    if (error) throw error;
    
    return data?.data || [];
  } catch (error: any) {
    console.error('Error fetching project users:', error);
    throw error;
  }
}

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
