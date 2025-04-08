
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export const useSelectedProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    localStorage.getItem('selectedProjectId')
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Save to localStorage whenever selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  }, [selectedProjectId]);

  // Check if the user has a selected project, otherwise redirect to project selection
  useEffect(() => {
    const checkSelectedProject = async () => {
      try {
        setIsLoading(true);
        // If we don't have a selected project, check if there are any projects
        if (!selectedProjectId) {
          const projects = await getProjects();
          if (projects.length === 0) {
            // If no projects, redirect to create project page
            navigate('/projects/new');
          } else if (projects.length === 1) {
            // If only one project, select it automatically
            setSelectedProjectId(projects[0].id);
          } else {
            // Multiple projects, redirect to projects list for selection
            navigate('/projects');
          }
        }
      } catch (error) {
        console.error('Error checking selected project:', error);
        toast({
          title: 'Error checking project',
          description: 'Could not verify selected project',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSelectedProject();
  }, [selectedProjectId, navigate]);

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const clearSelectedProject = () => {
    setSelectedProjectId(null);
  };

  return {
    selectedProjectId,
    selectProject,
    clearSelectedProject,
    isLoading
  };
};
