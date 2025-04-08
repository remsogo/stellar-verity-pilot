
import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export const useSelectedProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    localStorage.getItem('selectedProjectId')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  // Use localStorage effect with a dependency on selectedProjectId
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    } else if (selectedProjectId === null) {
      localStorage.removeItem('selectedProjectId');
    }
  }, [selectedProjectId]);

  // Check if the user has a selected project - only runs once
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

    // Only run once
    if (!hasChecked) {
      checkSelectedProject();
    }
  }, [selectedProjectId, hasChecked]);

  // Use callbacks for functions to prevent recreating them on each render
  const selectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const clearSelectedProject = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  return {
    selectedProjectId,
    selectProject,
    clearSelectedProject,
    isLoading,
    hasChecked
  };
};
