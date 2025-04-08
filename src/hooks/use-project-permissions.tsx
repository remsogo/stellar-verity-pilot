
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './use-user';
import { ProjectRole, ProjectMember } from '@/integrations/supabase/project-types';

export { ProjectRole, ProjectMember };

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
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('project_users')
          .select('role')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .maybeSingle();

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
          // Get all project members with raw query
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
            
            // For each member, get the user details from the user profiles table
            for (const member of membersData) {
              // In a production app, you would have a user_profiles table or similar
              // We're simplifying here by using email as the identifier
              membersList.push({
                id: member.id,
                email: member.user_id, // Using user_id as email for simplicity
                name: 'User', // Default name
                role: member.role as ProjectRole,
              });
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
      // Add the user to the project using a direct SQL query approach
      // This is a simplified version - in a real app, you'd first look up the user ID from the email
      const userId = email; // In a real app, you'd get the user ID from the email
      
      const { error: insertError } = await supabase
        .from('project_users')
        .insert({
          project_id: projectId,
          user_id: userId,
          role,
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          throw new Error('This user is already a member of this project.');
        }
        console.error('Error adding user to project:', insertError);
        throw new Error('Failed to add user to project.');
      }

      // Add the new member to the members list
      setMembers(prev => [
        ...prev,
        {
          id: Date.now().toString(), // Temporary ID until we refresh
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
