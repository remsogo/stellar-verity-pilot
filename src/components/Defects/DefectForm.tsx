
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Defect } from '@/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { DefectBasicInfo } from './DefectBasicInfo';
import { DefectStatusSection } from './DefectStatusSection';
import { DefectAssignmentSection } from './DefectAssignmentSection';
import { DefectProjectSection } from './DefectProjectSection';

// Define the defect status and severity types
const defectStatusEnum = ['open', 'in-progress', 'resolved', 'closed', 'reopened'] as const;
const defectSeverityEnum = ['low', 'medium', 'high', 'critical'] as const;

const defectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(defectStatusEnum),
  severity: z.enum(defectSeverityEnum),
  reporter: z.string().min(1, 'Reporter is required'),
  assignee: z.string().optional(),
  project_id: z.string().min(1, 'Project is required'),
  test_execution_id: z.string().optional(),
});

export type DefectFormValues = z.infer<typeof defectFormSchema>;

interface DefectFormProps {
  defect?: Defect;
  onSubmit: (values: DefectFormValues) => void;
  isLoading?: boolean;
  projects: { id: string; name: string }[];
  testExecutions?: { id: string; title: string }[];
}

export const DefectForm: React.FC<DefectFormProps> = ({
  defect,
  onSubmit,
  isLoading = false,
  projects,
  testExecutions = [],
}) => {
  const { toast } = useToast();

  const form = useForm<DefectFormValues>({
    resolver: zodResolver(defectFormSchema),
    defaultValues: defect
      ? {
          title: defect.title,
          description: defect.description || '',
          status: defect.status,
          severity: defect.severity,
          reporter: defect.reporter,
          assignee: defect.assignee || '',
          project_id: defect.project_id,
          test_execution_id: defect.test_execution_id || '',
        }
      : {
          title: '',
          description: '',
          status: 'open',
          severity: 'medium',
          reporter: '', // In a real app, this would be the current user
          assignee: '',
          project_id: projects.length > 0 ? projects[0].id : '',
          test_execution_id: '',
        },
  });

  const handleSubmit = (values: DefectFormValues) => {
    try {
      onSubmit(values);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving the defect.',
        variant: 'destructive',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <DefectBasicInfo />
          <DefectStatusSection />
          <DefectAssignmentSection />
          <DefectProjectSection projects={projects} testExecutions={testExecutions} />

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {defect ? 'Update Defect' : 'Create Defect'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
