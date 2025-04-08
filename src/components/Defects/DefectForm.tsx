
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Defect, TestCasePriority, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const defectStatusEnum = ['open', 'in-progress', 'resolved', 'closed', 'reopened'] as const;

const defectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(defectStatusEnum),
  severity: z.enum(['low', 'medium', 'high', 'critical'] as const),
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
          severity: TestCasePriority.MEDIUM,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Defect title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the defect in detail"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="reopened">Reopened</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reporter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporter</FormLabel>
                <FormControl>
                  <Input placeholder="Reporter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <FormControl>
                  <Input placeholder="Assignee name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {testExecutions.length > 0 && (
          <FormField
            control={form.control}
            name="test_execution_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link to Test Execution</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test execution (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {testExecutions.map((execution) => (
                      <SelectItem key={execution.id} value={execution.id}>
                        {execution.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Link this defect to a specific test execution (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {defect ? 'Update Defect' : 'Create Defect'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
