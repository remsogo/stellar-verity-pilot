
import React from 'react';
import { Navbar } from '@/components/Navigation/Navbar';
import { CustomSidebar } from '@/components/UI/CustomSidebar';
import { ProjectsList } from '@/components/Projects/ProjectsList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/components/ui/sidebar';

const Projects = () => {
  const queryClient = useQueryClient();
  const { isSidebarOpen } = useSidebar();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const handleProjectDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  return (
    <div className="flex h-screen overflow-hidden w-full bg-gradient-to-br from-background to-background/80">
      <CustomSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container py-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Projects</h1>
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
        </main>
      </div>
    </div>
  );
};

export default Projects;
