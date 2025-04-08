
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserX } from 'lucide-react';
import { ProjectMember, ProjectRole } from '@/hooks/use-project-permissions';

interface UserRoleActionsProps {
  member: ProjectMember;
  canModify: boolean;
  onUpdateRole: (memberId: string, role: ProjectRole) => void;
  onRemoveUser: (member: ProjectMember) => void;
}

export const UserRoleActions: React.FC<UserRoleActionsProps> = ({
  member,
  canModify,
  onUpdateRole,
  onRemoveUser,
}) => {
  if (!canModify) {
    return <div className="pr-9">-</div>; // Spacer for alignment
  }

  return (
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
          onClick={() => onUpdateRole(member.id, 'owner')}
        >
          Make Owner
        </DropdownMenuItem>
        <DropdownMenuItem 
          disabled={member.role === 'admin'}
          onClick={() => onUpdateRole(member.id, 'admin')}
        >
          Make Admin
        </DropdownMenuItem>
        <DropdownMenuItem 
          disabled={member.role === 'editor'}
          onClick={() => onUpdateRole(member.id, 'editor')}
        >
          Make Editor
        </DropdownMenuItem>
        <DropdownMenuItem 
          disabled={member.role === 'viewer'}
          onClick={() => onUpdateRole(member.id, 'viewer')}
        >
          Make Viewer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={() => onRemoveUser(member)}
        >
          <UserX className="h-4 w-4 mr-2" />
          Remove User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
