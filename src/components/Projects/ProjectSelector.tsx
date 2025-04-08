
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectedProject } from '@/hooks/use-selected-project';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types/project';

export const ProjectSelector = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedProjectId, selectProject, refreshProjectSelection } = useSelectedProject();
  
  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
  
  // Whenever the component mounts, refresh project selection
  useEffect(() => {
    refreshProjectSelection();
  }, [refreshProjectSelection]);
  
  const selectedProject = projects && selectedProjectId ? 
    projects.find(project => project.id === selectedProjectId) : 
    undefined;
  
  if (isLoading) {
    return <Skeleton className="h-9 w-[200px]" />;
  }
  
  if (!projects || projects.length === 0) {
    return (
      <Button 
        variant="outline" 
        onClick={() => navigate('/projects/new')}
        className="w-[200px] justify-start text-left font-normal"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create New Project
      </Button>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedProject ? selectedProject.name : "Select Project"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.id}
                  onSelect={(value) => {
                    selectProject(value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProjectId === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {project.name}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => {
                  navigate('/projects/new');
                  setOpen(false);
                }}
                className="text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
