
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon, TrashIcon, UserPlus } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Switch } from '@/components/ui/switch';

export const ParametersUserSettings = () => {
  const { user } = useUser();
  
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'QA Engineer', status: 'Active' },
    { id: 4, name: user?.name || 'Current User', email: user?.email || 'current@example.com', role: 'Admin', status: 'Active' },
  ];
  
  const handleSave = () => {
    toast({
      title: "User settings saved",
      description: "User management settings have been updated successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and roles in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">System Users</h3>
              <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </div>
          
          <ScrollArea className="h-[320px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{u.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={u.role.toLowerCase()}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="qa">QA Engineer</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                        {u.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Manage what different roles can do in the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="role-select">Select Role</Label>
              <Select defaultValue="admin">
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="qa">QA Engineer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-md font-medium">Permission Settings</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Test Cases</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-view-tests">View Test Cases</Label>
                  <Switch id="perm-view-tests" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-create-tests">Create Test Cases</Label>
                  <Switch id="perm-create-tests" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-edit-tests">Edit Test Cases</Label>
                  <Switch id="perm-edit-tests" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-delete-tests">Delete Test Cases</Label>
                  <Switch id="perm-delete-tests" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Projects</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-view-projects">View Projects</Label>
                  <Switch id="perm-view-projects" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-create-projects">Create Projects</Label>
                  <Switch id="perm-create-projects" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-manage-projects">Manage Projects</Label>
                  <Switch id="perm-manage-projects" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-invite-users">Invite Users</Label>
                  <Switch id="perm-invite-users" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
