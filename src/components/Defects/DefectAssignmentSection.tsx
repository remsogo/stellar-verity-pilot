
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const DefectAssignmentSection = () => {
  const form = useFormContext();

  return (
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
  );
};
