
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';
import { getProjectById, getAllProjects } from './projectQueries';
import { createNewProject } from './projectMutations';
import { updateProjectDetails, removeProject } from './projectMutations';

/**
 * Retrieves all projects the current user has access to
 */
export async function getProjects(): Promise<Project[]> {
  try {
    return await getAllProjects();
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
    return await getProjectById(id);
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
    const project = await createNewProject(name, description);
    console.log('Project created successfully:', project);
    return project;
  } catch (error: any) {
    console.error('Error in createProject flow:', error);
    
    // Handle specific error messages in a more user-friendly way
    if (error.message && error.message.includes('already exists')) {
      throw new Error('A project with this name already exists');
    }
    
    // Handle recursion errors
    if (error.message && error.message.includes('recursion')) {
      throw new Error('Database policy error - please try again or contact support');
    }
    
    // For any other error, just propagate it to be handled by the UI
    throw error;
  }
}

/**
 * Updates an existing project
 */
export async function updateProject(id: string, updates: { name?: string; description?: string }): Promise<Project | null> {
  try {
    return await updateProjectDetails(id, updates);
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
    return await removeProject(id);
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
