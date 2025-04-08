
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DefectProjectSectionProps {
  projects: { id: string; name: string }[];
  testExecutions?: { id: string; title: string }[];
}

export const DefectProjectSection: React.FC<DefectProjectSectionProps> = ({
  projects,
  testExecutions = [],
}) => {
  const form = useFormContext();

  return (
    <>
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
    </>
  );
};
