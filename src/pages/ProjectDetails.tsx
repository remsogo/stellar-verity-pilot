
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, deleteProject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Pencil, Trash2, UserPlus, ArrowLeft, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { InviteUserModal } from '@/components/Projects/InviteUserModal';
import { ProjectUsersTable } from '@/components/Projects/ProjectUsersTable';
import { useProjectPermissions } from '@/hooks/use-project-permissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { toast } from '@/components/ui/use-toast';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { canEdit, canDelete, canManageUsers } = useProjectPermissions(id);
  
  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id
  });

  const handleDelete = async () => {
    if (!canDelete) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this project.",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      await deleteProject(id!);
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      navigate('/projects');
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message || "There was a problem deleting the project.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="container py-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Project not found</h3>
            <p className="text-muted-foreground mt-2">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button 
              className="mt-4" 
              asChild
            >
              <Link to="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" asChild>
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          <div className="flex gap-2">
            {canManageUsers && (
              <InviteUserModal
                projectId={id!}
                trigger={
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite User
                  </Button>
                }
                onInvited={() => refetch()}
              />
            )}
            {canEdit && (
              <Button variant="outline" asChild>
                <Link to={`/projects/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Team Members
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <CardDescription>
                  Created on {format(new Date(project.created_at), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.description || 'No description provided.'}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
                <h3 className="text-lg font-medium">Project Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/test-cases?project=${id}`}>
                      Test Cases
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/test-executions?project=${id}`}>
                      Test Executions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/defects?project=${id}`}>
                      Defects
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage users who have access to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectUsersTable projectId={id!} />
              </CardContent>
              {canManageUsers && (
                <CardFooter className="border-t pt-6">
                  <InviteUserModal
                    projectId={id!}
                    trigger={
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" /> Invite New User
                      </Button>
                    }
                    onInvited={() => refetch()}
                  />
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all related data including test cases, executions, and defects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ProjectDetails;
