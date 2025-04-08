
import React from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseMetadataProps {
  control: Control<TestCaseFormValues>;
}

export const TestCaseMetadata: React.FC<TestCaseMetadataProps> = ({
  control,
}) => {
  return (
    <div className="flex space-x-4">
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};
