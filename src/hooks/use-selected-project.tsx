
import { useState, useEffect, useCallback, useRef } from 'react';
import { getProjects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export const useSelectedProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    localStorage.getItem('selectedProjectId')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const initialCheckPerformed = useRef(false);

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
    // Prevent multiple executions of the effect
    if (initialCheckPerformed.current || hasChecked) return;
    initialCheckPerformed.current = true;
    
    const checkSelectedProject = async () => {
      try {
        setIsLoading(true);
        console.log('Checking for selected project', { selectedProjectId });
        
        // If we don't have a selected project, check if there are any projects
        if (!selectedProjectId) {
          const projects = await getProjects();
          console.log('Projects fetched:', projects);
          
          if (projects.length === 1) {
            // If only one project, select it automatically
            console.log('Auto-selecting the only project', projects[0].id);
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

  // Use callbacks for functions to prevent recreating them on each render
  const selectProject = useCallback((projectId: string) => {
    console.log('Selecting project', projectId);
    setSelectedProjectId(projectId);
  }, []);

  const clearSelectedProject = useCallback(() => {
    console.log('Clearing selected project');
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
