
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ProjectMember, ProjectRole, useProjectPermissions } from '@/hooks/use-project-permissions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, UserX } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

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
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {member.name 
                          ? member.name.substring(0, 2).toUpperCase()
                          : member.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name || 'User'}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{member.role}</span>
                </TableCell>
                {canManageUsers && (
                  <TableCell className="text-right">
                    {canModify ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            disabled={member.role === 'owner'}
                            onClick={() => handleUpdateRole(member.id, 'owner')}
                          >
                            Make Owner
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={member.role === 'admin'}
                            onClick={() => handleUpdateRole(member.id, 'admin')}
                          >
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={member.role === 'editor'}
                            onClick={() => handleUpdateRole(member.id, 'editor')}
                          >
                            Make Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={member.role === 'viewer'}
                            onClick={() => handleUpdateRole(member.id, 'viewer')}
                          >
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setUserToRemove(member)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="pr-9">-</div> // Spacer for alignment
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToRemove?.email} from this project?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveUser}
              className="bg-destructive text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
