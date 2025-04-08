
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './use-user';

export type ProjectRole = 'owner' | 'admin' | 'editor' | 'viewer';

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

        // Get current user's role for this project
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('project_users')
          .select('role')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .single();

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
          const { data: membersData, error: membersError } = await supabase
            .from('project_users')
            .select('id, user_id, role')
            .eq('project_id', projectId);

          if (membersError) {
            console.error('Error fetching project members:', membersError);
            setError('Failed to fetch project members.');
            setMembers([]);
          } else if (membersData) {
            // Create an array to store the final members data with user info
            const membersList: ProjectMember[] = [];
            
            // Fetch user details for each member
            // Note: In a production app, you might want to create a user_profiles table
            // to avoid making separate auth.users queries which may not be possible
            // with RLS restrictions
            for (const member of membersData) {
              const { data: userData } = await supabase.auth.admin.getUserById(member.user_id);
              
              if (userData?.user) {
                membersList.push({
                  id: member.id,
                  email: userData.user.email || 'No email',
                  name: userData.user.user_metadata?.full_name,
                  role: member.role as ProjectRole,
                });
              }
            }
            
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
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Error finding user by email:', userError);
        throw new Error('User not found with that email.');
      }

      // Add the user to the project
      const { error: insertError } = await supabase
        .from('project_users')
        .insert({
          project_id: projectId,
          user_id: userData.id,
          role,
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          throw new Error('This user is already a member of this project.');
        }
        console.error('Error adding user to project:', insertError);
        throw new Error('Failed to add user to project.');
      }

      // Refresh the members list
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
      const { error } = await supabase
        .from('project_users')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('project_id', projectId);

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
      const { error } = await supabase
        .from('project_users')
        .delete()
        .eq('id', memberId)
        .eq('project_id', projectId);

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
