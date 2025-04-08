
import { useState, useEffect, useCallback, useRef } from 'react';
import { getProjects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Project } from '@/types/project';

export const useSelectedProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    localStorage.getItem('selectedProjectId')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const initialCheckPerformed = useRef(false);

  // Separate effect for localStorage updates
  useEffect(() => {
    if (selectedProjectId) {
      console.log('Storing project ID in localStorage:', selectedProjectId);
      localStorage.setItem('selectedProjectId', selectedProjectId);
    } else if (selectedProjectId === null) {
      console.log('Removing project ID from localStorage');
      localStorage.removeItem('selectedProjectId');
    }
  }, [selectedProjectId]);

  // Initial project check - only runs once
  useEffect(() => {
    // Guard against multiple executions
    if (initialCheckPerformed.current || hasChecked) return;
    initialCheckPerformed.current = true;
    
    const checkSelectedProject = async () => {
      try {
        setIsLoading(true);
        console.log('Checking for selected project', { selectedProjectId });
        
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects || []);
        console.log('Projects fetched:', fetchedProjects);
        
        // If we don't have a selected project, check if there are any projects
        if (!selectedProjectId && fetchedProjects && fetchedProjects.length > 0) {
          // Auto-select the first project (usually the most recent)
          console.log('Auto-selecting the first project', fetchedProjects[0].id);
          setSelectedProjectId(fetchedProjects[0].id);
        }
        
        // If we have a selected project, validate it exists in the fetched projects
        else if (selectedProjectId) {
          const projectExists = fetchedProjects?.some(p => p.id === selectedProjectId);
          if (!projectExists) {
            console.log('Selected project not found in user projects, clearing selection');
            setSelectedProjectId(null);
            toast({
              title: 'Project not found',
              description: 'The previously selected project is no longer available',
              variant: 'destructive',
            });
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

  // Function to force a project check
  const refreshProjectSelection = useCallback(async () => {
    console.log('Forcing project refresh');
    initialCheckPerformed.current = false;
    setHasChecked(false);
    
    try {
      setIsLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects || []);
      
      // Verify if selected project still exists
      if (selectedProjectId) {
        const projectExists = fetchedProjects?.some(p => p.id === selectedProjectId);
        if (!projectExists) {
          setSelectedProjectId(null);
          toast({
            title: 'Project not found',
            description: 'The selected project is no longer available',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  // Use callbacks for functions to prevent recreating them
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
    projects,
    selectProject,
    clearSelectedProject,
    refreshProjectSelection,
    isLoading,
    hasChecked
  };
};
