
import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { useSelectedProject } from '@/hooks/use-selected-project';
import { toast } from '@/components/ui/use-toast';

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
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { selectedProjectId, selectProject } = useSelectedProject();
  const [selectionInProgress, setSelectionInProgress] = useState(false);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject(projectToDelete);
      setProjectToDelete(null);
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      onDelete();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error.message || "There was a problem deleting the project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectProject = async (id: string) => {
    // Prevent multiple selections at once
    if (selectionInProgress) return;
    
    try {
      setSelectionInProgress(true);
      
      // Select the project
      selectProject(id);
      
      // Show a toast notification to confirm selection
      toast({
        title: "Project selected",
        description: `Selected project: ${projects.find(p => p.id === id)?.name}`,
      });
      
      // Navigate to home page after selection
      setTimeout(() => {
        navigate('/', { replace: true });
        setSelectionInProgress(false);
      }, 300);
    } catch (error) {
      console.error('Error selecting project:', error);
      setSelectionInProgress(false);
      toast({
        title: "Error",
        description: "Failed to select project. Please try again.",
        variant: "destructive"
      });
    }
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
              isSelected={selectedProjectId === project.id}
              onSelect={handleSelectProject}
              onDelete={(id) => setProjectToDelete(id)}
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
