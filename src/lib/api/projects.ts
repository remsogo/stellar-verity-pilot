
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

export async function inviteUserToProject(projectId: string, email: string, role: string = 'viewer') {
  try {
    // This is a mock function since we don't have a proper invite system yet
    // In a real app, this would create an invitation record and send an email
    toast({
      title: 'Invitation sent',
      description: `An invitation has been sent to ${email}.`,
    });
    
    return { success: true, email, projectId, role };
  } catch (error: any) {
    console.error('Error inviting user:', error);
    throw error; // We rethrow to let the component handle the error
  }
}
