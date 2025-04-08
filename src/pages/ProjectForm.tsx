
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ProjectForm as ProjectFormComponent } from '@/components/Projects/ProjectForm';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProject } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: isEditing
  });

  return (
    <MainLayout>
      <div className="container max-w-2xl py-6">
        {isEditing && isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex justify-between pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <ProjectFormComponent 
            projectId={id} 
            initialData={project} 
            isEditing={isEditing} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectForm;
