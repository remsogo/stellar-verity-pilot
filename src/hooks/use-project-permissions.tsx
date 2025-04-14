
import { useState, useEffect } from 'react';
import { useUser } from './use-user';
import { 
  getProjectUsers, 
  addUserToProject as apiAddUserToProject,
  updateUserRole as apiUpdateUserRole,
  removeUserFromProject as apiRemoveUserFromProject
} from '@/lib/api/projects';
import type { ProjectRole } from '@/integrations/supabase/project-types';
import { supabase } from '@/integrations/supabase/client';

// Re-export types with proper syntax for isolated modules
export type { ProjectRole };
export interface ProjectMember {
  id: string;
  email: string;
  name?: string;
  role: ProjectRole;
}

export const useProjectPermissions = (projectId?: string) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canEdit = userRole === 'owner' || userRole === 'admin' || userRole === 'editor';
  const canManageUsers = userRole === 'owner' || userRole === 'admin';
  const canDelete = userRole === 'owner';

  useEffect(() => {
    if (!projectId || !user) {
      setIsLoading(false);
      setUserRole(null);
      setIsOwner(false);
      setMembers([]);
      return;
    }

    const fetchProjectPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching project permissions for project:", projectId);

        // First check if user is the owner
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('owner_id')
          .eq('id', projectId)
          .single();
        
        if (projectError) {
          console.error("Error checking project ownership:", projectError);
          throw projectError;
        }
        
        const isProjectOwner = project && project.owner_id === user.id;
        setIsOwner(isProjectOwner);
        
        if (isProjectOwner) {
          setUserRole('owner');
        } else {
          // Check project_users table for role
          const { data: userRole, error: roleError } = await supabase
            .from('project_users')
            .select('role')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single();
          
          if (!roleError && userRole) {
            setUserRole(userRole.role as ProjectRole);
          } else {
            setUserRole(null);
          }
        }

        // Get all project members
        const membersData = await getProjectUsers(projectId);
        console.log("Project members data:", membersData);

        if (membersData && Array.isArray(membersData)) {
          // Convert the raw data to ProjectMember format
          const membersList: ProjectMember[] = membersData.map((member) => ({
            id: member.id,
            email: member.email || "",
            name: member.full_name || undefined,
            role: member.role as ProjectRole,
          }));
          
          setMembers(membersList);
        } else {
          setMembers([]);
        }
      } catch (err: any) {
        console.error('Error in useProjectPermissions:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectPermissions();
  }, [projectId, user]);

  // Function to add a user to the project
  const addUserToProject = async (email: string, role: ProjectRole): Promise<boolean> => {
    if (!projectId || !canManageUsers) return false;

    try {
      const newMember = await apiAddUserToProject(projectId, email, role);

      setMembers(prev => [...prev, {
        id: newMember.id,
        email: newMember.email as string,
        name: newMember.full_name as string || undefined,
        role: newMember.role as ProjectRole,
      }]);

      return true;
    } catch (error: any) {
      console.error('Error in addUserToProject:', error);
      throw error;
    }
  };

  // Function to update a user's role in the project
  const updateUserRole = async (memberId: string, newRole: ProjectRole): Promise<boolean> => {
    if (!projectId || !canManageUsers) return false;

    try {
      const result = await apiUpdateUserRole(projectId, memberId, newRole);

      if (result) {
        // Update local state
        setMembers(prev => 
          prev.map(member => 
            member.id === memberId ? { ...member, role: newRole } : member
          )
        );
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error in updateUserRole:', error);
      throw error;
    }
  };

  // Function to remove a user from the project
  const removeUserFromProject = async (memberId: string): Promise<boolean> => {
    if (!projectId || !canManageUsers) return false;

    try {
      const success = await apiRemoveUserFromProject(projectId, memberId);

      if (success) {
        // Update local state
        setMembers(prev => prev.filter(member => member.id !== memberId));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error in removeUserFromProject:', error);
      throw error;
    }
  };

  return {
    isLoading,
    userRole,
    isOwner,
    members,
    error,
    canEdit,
    canManageUsers,
    canDelete,
    addUserToProject,
    updateUserRole,
    removeUserFromProject,
  };
};
