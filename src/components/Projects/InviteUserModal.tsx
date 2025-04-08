
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ProjectRole, useProjectPermissions } from '@/hooks/use-project-permissions';

interface InviteUserModalProps {
  projectId: string;
  trigger: React.ReactNode;
  onInvited?: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  projectId,
  trigger,
  onInvited,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectRole>('viewer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { addUserToProject, canManageUsers } = useProjectPermissions(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!canManageUsers) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to invite users to this project.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addUserToProject(email, role);
      toast({
        title: "User invited",
        description: `Successfully added ${email} to the project as ${role}.`,
      });
      setEmail('');
      setRole('viewer');
      setOpen(false);
      if (onInvited) onInvited();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: "Failed to invite user",
        description: error.message || "There was a problem inviting the user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canManageUsers) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Invite a team member to collaborate on this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as ProjectRole)}>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
