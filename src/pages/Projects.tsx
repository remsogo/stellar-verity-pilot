
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ProjectsList } from '@/components/Projects/ProjectsList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const Projects = () => {
  const queryClient = useQueryClient();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const handleProjectDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  return (
    <MainLayout>
      <div className="container py-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between pt-4">
                    <Skeleton className="h-9 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ProjectsList projects={projects || []} onDelete={handleProjectDelete} />
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;
