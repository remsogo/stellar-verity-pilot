
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProjectMember, ProjectRole } from '@/hooks/use-project-permissions';
import { UserRoleActions } from './UserRoleActions';

interface UserTableRowProps {
  member: ProjectMember;
  isCurrentUser: boolean;
  canModify: boolean;
  canManageUsers: boolean;
  onUpdateRole: (memberId: string, role: ProjectRole) => void;
  onRemoveUser: (member: ProjectMember) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  member,
  isCurrentUser,
  canModify,
  canManageUsers,
  onUpdateRole,
  onRemoveUser,
}) => {
  return (
    <TableRow>
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
          <UserRoleActions
            member={member}
            canModify={canModify}
            onUpdateRole={onUpdateRole}
            onRemoveUser={onRemoveUser}
          />
        </TableCell>
      )}
    </TableRow>
  );
};
