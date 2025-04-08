
import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export const useSelectedProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    localStorage.getItem('selectedProjectId')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  // Save to localStorage whenever selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  }, [selectedProjectId]);

  // Check if the user has a selected project
  useEffect(() => {
    const checkSelectedProject = async () => {
      if (hasChecked) return; // Avoid running multiple times
      
      try {
        setIsLoading(true);
        // If we don't have a selected project, check if there are any projects
        if (!selectedProjectId) {
          const projects = await getProjects();
          
          if (projects.length === 1) {
            // If only one project, select it automatically
            setSelectedProjectId(projects[0].id);
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
        setHasChecked(true);
      }
    };

    checkSelectedProject();
  }, [selectedProjectId, hasChecked]);

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
    isLoading,
    hasChecked
  };
};
