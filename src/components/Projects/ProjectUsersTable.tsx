
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { ProjectMember, ProjectRole, useProjectPermissions } from '@/hooks/use-project-permissions';
import { useUser } from '@/hooks/use-user';
import { UserTableRow } from './UserTableRow';
import { RemoveUserDialog } from './RemoveUserDialog';

interface ProjectUsersTableProps {
  projectId: string;
}

export const ProjectUsersTable: React.FC<ProjectUsersTableProps> = ({ projectId }) => {
  const { members, userRole, canManageUsers, updateUserRole, removeUserFromProject } = useProjectPermissions(projectId);
  const [userToRemove, setUserToRemove] = useState<ProjectMember | null>(null);
  const { user } = useUser();

  const handleUpdateRole = async (memberId: string, newRole: ProjectRole) => {
    try {
      await updateUserRole(memberId, newRole);
      toast({
        title: 'Role updated',
        description: 'User role has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating role',
        description: error.message || 'Failed to update user role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;
    
    try {
      await removeUserFromProject(userToRemove.id);
      toast({
        title: 'User removed',
        description: `${userToRemove.email} has been removed from the project.`,
      });
      setUserToRemove(null);
    } catch (error: any) {
      toast({
        title: 'Error removing user',
        description: error.message || 'Failed to remove user from project.',
        variant: 'destructive',
      });
    }
  };

  if (!members.length) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No users found for this project.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isCurrentUser = member.email === user?.email;
            const canModify = canManageUsers && !isCurrentUser;
            
            return (
              <UserTableRow
                key={member.id}
                member={member}
                isCurrentUser={isCurrentUser}
                canModify={canModify}
                canManageUsers={canManageUsers}
                onUpdateRole={handleUpdateRole}
                onRemoveUser={setUserToRemove}
              />
            );
          })}
        </TableBody>
      </Table>

      <RemoveUserDialog
        userToRemove={userToRemove}
        onClose={() => setUserToRemove(null)}
        onConfirm={handleRemoveUser}
      />
    </>
  );
};
