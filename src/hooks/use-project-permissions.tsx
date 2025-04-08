import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './use-user';
import type { ProjectRole, ProjectMember } from '@/integrations/supabase/project-types';

export type { ProjectRole, ProjectMember };

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

        // Get current user's role for this project with raw query
        const { data: userRoleData, error: userRoleError } = await supabase.rpc(
          'get_project_users',
          { p_project_id: projectId }
        ).then(response => {
          const userRecord = response.data?.find(record => record.user_id === user.id);
          return { 
            data: userRecord ? { role: userRecord.role } : null, 
            error: response.error 
          };
        });

        if (userRoleError && userRoleError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" - we handle this case by setting userRole to null
          console.error('Error fetching user role:', userRoleError);
          setError('Failed to fetch your permissions for this project.');
          setUserRole(null);
        } else {
          setUserRole(userRoleData?.role as ProjectRole || null);
        }

        // Only fetch members if the user has access to the project
        if (userRoleData?.role) {
          // Get all project members
          const { data: membersData, error: membersError } = await supabase.rpc(
            'get_project_users',
            { p_project_id: projectId }
          );

          if (membersError) {
            console.error('Error fetching project members:', membersError);
            setError('Failed to fetch project members.');
            setMembers([]);
          } else if (membersData) {
            // Convert the raw data to ProjectMember format
            const membersList: ProjectMember[] = membersData.map(member => ({
              id: member.id,
              email: member.email || member.user_id,
              name: member.full_name || 'User',
              role: member.role as ProjectRole,
            }));
            
            setMembers(membersList);
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
        if (error.code === '23505') { // Unique violation
          throw new Error('This user is already a member of this project.');
        }
        console.error('Error adding user to project:', error);
        throw new Error('Failed to add user to project.');
      }

      // Add the new member to the members list
      setMembers(prev => [
        ...prev,
        {
          id: data || Date.now().toString(), // Use the returned ID or a temporary one
          email: email,
          name: 'New User',
          role,
        }
      ]);

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

      const { error } = await supabase.rpc(
        'update_user_role',
        {
          p_project_id: projectId,
          p_user_id: memberToUpdate.email,
          p_role: newRole
        }
      );

      if (error) {
        console.error('Error updating user role:', error);
        throw new Error('Failed to update user role.');
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

      const { error } = await supabase.rpc(
        'remove_user_from_project',
        {
          p_project_id: projectId,
          p_user_id: memberToRemove.email
        }
      );

      if (error) {
        console.error('Error removing user from project:', error);
        throw new Error('Failed to remove user from project.');
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
