
import React, { useState } from 'react';
import { createDefect } from '@/lib/api/defects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DefectForm, DefectFormValues } from './DefectForm';
import { Bug } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

interface CreateDefectFromExecutionProps {
  testExecutionId: string;
  testCaseTitle: string;
  onDefectCreated?: () => void;
  projectId: string;
}

export const CreateDefectFromExecution: React.FC<CreateDefectFromExecutionProps> = ({
  testExecutionId,
  testCaseTitle,
  onDefectCreated,
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (values: DefectFormValues) => {
    setIsSubmitting(true);
    try {
      // Set the test execution ID in the form values
      const defectData = {
        ...values,
        test_execution_id: testExecutionId,
        reporter: user?.email || values.reporter,
      };

      await createDefect(defectData);
      toast({
        title: 'Defect created',
        description: 'The defect has been created successfully.',
      });
      setIsOpen(false);
      if (onDefectCreated) {
        onDefectCreated();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while creating the defect.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock projects for now - in a real app, you'd fetch these from the API
  const projects = [
    { id: projectId, name: 'Current Project' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bug className="h-4 w-4" />
          Report Defect
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report a Defect</DialogTitle>
        </DialogHeader>
        <DefectForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          projects={projects}
          defect={{
            id: '',
            title: `Issue with "${testCaseTitle}"`,
            description: '',
            status: 'open',
            severity: 'medium',
            reporter: user?.email || '',
            project_id: projectId,
            test_execution_id: testExecutionId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
