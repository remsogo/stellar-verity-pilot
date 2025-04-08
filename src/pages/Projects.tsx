
import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navigation/Navbar';
import { CustomSidebar } from '@/components/UI/CustomSidebar';
import { ProjectsList } from '@/components/Projects/ProjectsList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Projects = () => {
  const queryClient = useQueryClient();
  const { open } = useSidebar();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: !!user,
    retry: 1, // Only retry once to avoid excessive retries on policy errors
    meta: {
      onError: (error: any) => {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error fetching projects",
          description: error.message || "There was an error fetching your projects",
          variant: "destructive"
        });
      }
    }
  });

  const handleProjectDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/auth');
    }
  }, [user, userLoading, navigate]);

  // Adding a console log to track renders
  useEffect(() => {
    console.log("Projects component rendered", { user, projects, error });
  }, [user, projects, error]);

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

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
            ) : error ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-destructive">Error loading projects</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  There was a problem loading your projects.
                </p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}
                  variant="outline"
                >
                  Try Again
                </Button>
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
