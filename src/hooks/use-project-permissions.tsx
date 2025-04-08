
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './use-user';
import type { ProjectRole } from '@/integrations/supabase/project-types';

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
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canEdit = userRole === 'owner' || userRole === 'admin' || userRole === 'editor';
  const canManageUsers = userRole === 'owner' || userRole === 'admin';
  const canDelete = userRole === 'owner';

  useEffect(() => {
    if (!projectId || !user) {
      setIsLoading(false);
      setUserRole(null);
      setMembers([]);
      return;
    }

    const fetchProjectPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all project members
        const { data: membersData, error: membersError } = await supabase
          .rpc('get_project_users', { p_project_id: projectId });

        if (membersError) {
          console.error('Error fetching project members:', membersError);
          setError('Failed to fetch project members.');
          setMembers([]);
          setUserRole(null);
        } else if (membersData) {
          // Find current user's role
          const currentUserData = Array.isArray(membersData) 
            ? membersData.find((member: any) => member.user_id === user.id)
            : null;
          
          setUserRole(currentUserData?.role as ProjectRole || null);

          // Convert the raw data to ProjectMember format
          if (Array.isArray(membersData)) {
            const membersList: ProjectMember[] = membersData.map((member: any) => ({
              id: member.id as string,
              email: member.email as string,
              name: member.full_name as string || 'User',
              role: member.role as ProjectRole,
            }));
            
            setMembers(membersList);
          } else {
            setMembers([]);
          }
        }
      } catch (err) {
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
      const { data, error } = await supabase.rpc(
        'add_user_to_project',
        {
          p_project_id: projectId,
          p_user_id: email,
          p_role: role
        }
      );

      if (error) {
        console.error('Error adding user to project:', error);
        throw new Error(error.message || 'Failed to add user to project.');
      }

      // Add the new member to the members list
      const newMember: ProjectMember = {
        id: data.id as string,
        email: data.email as string,
        name: data.full_name as string || 'New User',
        role: data.role as ProjectRole,
      };

      setMembers(prev => [...prev, newMember]);

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
      const memberToUpdate = members.find(m => m.id === memberId);
      if (!memberToUpdate) {
        throw new Error('Member not found');
      }

      const { data, error } = await supabase.rpc(
        'update_user_role',
        {
          p_project_id: projectId,
          p_user_id: memberToUpdate.email,
          p_role: newRole
        }
      );

      if (error) {
        console.error('Error updating user role:', error);
        throw new Error(error.message || 'Failed to update user role.');
      }

      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );

      return true;
    } catch (error: any) {
      console.error('Error in updateUserRole:', error);
      throw error;
    }
  };

  // Function to remove a user from the project
  const removeUserFromProject = async (memberId: string): Promise<boolean> => {
    if (!projectId || !canManageUsers) return false;

    try {
      const memberToRemove = members.find(m => m.id === memberId);
      if (!memberToRemove) {
        throw new Error('Member not found');
      }

      const { data, error } = await supabase.rpc(
        'remove_user_from_project',
        {
          p_project_id: projectId,
          p_user_id: memberToRemove.email
        }
      );

      if (error) {
        console.error('Error removing user from project:', error);
        throw new Error(error.message || 'Failed to remove user from project.');
      }

      // Update local state
      setMembers(prev => prev.filter(member => member.id !== memberId));

      return true;
    } catch (error: any) {
      console.error('Error in removeUserFromProject:', error);
      throw error;
    }
  };

  return {
    isLoading,
    userRole,
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
