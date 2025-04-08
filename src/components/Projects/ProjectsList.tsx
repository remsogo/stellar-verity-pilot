
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InviteUserModal } from './InviteUserModal';
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
import { deleteProject } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface ProjectsListProps {
  projects: Project[];
  onDelete: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onDelete }) => {
  const navigate = useNavigate();
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    await deleteProject(projectToDelete);
    setProjectToDelete(null);
    onDelete();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-2">
            Create your first project to get started.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/projects/new')}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              createdAt={project.created_at}
              onDelete={(id) => setProjectToDelete(id)}
              onInvite={(id) => {
                // This will be handled by the InviteUserModal trigger
              }}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
