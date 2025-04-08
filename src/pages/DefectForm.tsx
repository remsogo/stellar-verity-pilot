
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import { DefectForm as DefectFormComponent, DefectFormValues } from '@/components/Defects/DefectForm';
import { getDefect, createDefect, updateDefect } from '@/lib/api/defects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';

const DefectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch defect details if editing an existing defect
  const { data: defect, isLoading: isLoadingDefect } = useQuery({
    queryKey: ['defect', id],
    queryFn: () => getDefect(id!),
    enabled: !!id,
  });

  // Mock projects - in a real app, fetch these from the API
  const projects = [
    { id: 'project-1', name: 'Project Alpha' },
    { id: 'project-2', name: 'Project Beta' },
  ];

  const createDefectMutation = useMutation({
    mutationFn: createDefect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      toast({
        title: 'Success',
        description: 'Defect created successfully',
      });
      navigate('/defects');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create defect: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateDefectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DefectFormValues> }) => 
      updateDefect(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      queryClient.invalidateQueries({ queryKey: ['defect', id] });
      toast({
        title: 'Success',
        description: 'Defect updated successfully',
      });
      navigate('/defects');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update defect: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (values: DefectFormValues) => {
    setIsSubmitting(true);

    // Ensure required fields are filled
    const formData = {
      title: values.title || '',
      reporter: user?.email || values.reporter || '',
      project_id: values.project_id || projects[0].id,
      description: values.description || '',
      status: values.status || 'open', // Ensuring status is not optional
      severity: values.severity || 'medium', // Ensuring severity is not optional
      assignee: values.assignee,
      test_execution_id: values.test_execution_id
    };

    if (id) {
      updateDefectMutation.mutate({
        id,
        data: formData,
      });
    } else {
      createDefectMutation.mutate(formData);
    }
  };

  const isLoading = isLoadingDefect || isSubmitting;
  const pageTitle = id ? 'Edit Defect' : 'Create New Defect';
  const pageDescription = id 
    ? 'Update the details of an existing defect' 
    : 'Report a new defect found during testing';

  return (
    <MainLayout
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/defects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Defects
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <DefectFormComponent
              defect={defect}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              projects={projects}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DefectFormPage;
