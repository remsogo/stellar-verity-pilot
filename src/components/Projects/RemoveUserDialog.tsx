
import React from 'react';
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
import { ProjectMember } from '@/hooks/use-project-permissions';

interface RemoveUserDialogProps {
  userToRemove: ProjectMember | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveUserDialog: React.FC<RemoveUserDialogProps> = ({
  userToRemove,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={!!userToRemove} onOpenChange={onClose}>
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
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
