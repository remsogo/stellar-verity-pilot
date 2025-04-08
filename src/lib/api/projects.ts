
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
  } catch (error) {
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
  } catch (error) {
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
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: 'Project created',
      description: `Project "${name}" has been created successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    toast({
      title: 'Error creating project',
      description: error.message,
      variant: 'destructive',
    });
    return null;
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
    
    toast({
      title: 'Project updated',
      description: `Project "${updates.name || 'project'}" has been updated successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    toast({
      title: 'Error updating project',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: 'Project deleted',
      description: 'The project has been deleted successfully.',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    toast({
      title: 'Error deleting project',
      description: error.message,
      variant: 'destructive',
    });
    return false;
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
  } catch (error) {
    console.error('Error inviting user:', error);
    toast({
      title: 'Error inviting user',
      description: error.message,
      variant: 'destructive',
    });
    return { success: false };
  }
}
