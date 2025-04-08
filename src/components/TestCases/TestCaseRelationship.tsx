
import React from "react";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseRelationshipProps {
  control: Control<TestCaseFormValues>;
  isLoading: boolean;
  parentTestCases: Array<{ id: string; title: string }>;
  watch: UseFormWatch<TestCaseFormValues>;
}

export const TestCaseRelationship: React.FC<TestCaseRelationshipProps> = ({
  control,
  isLoading,
  parentTestCases,
  watch,
}) => {
  const isParent = watch("is_parent");

  return (
    <div className="bg-muted/50 p-4 rounded-md space-y-4">
      <h3 className="text-md font-medium">Test Case Relationship</h3>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="is_parent"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="is_parent" 
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_parent">This is a parent test case</Label>
            </div>
          )}
        />
      </div>
      
      {!isParent && (
        <div>
          <Label htmlFor="parent_id">Parent Test Case (optional)</Label>
          <Controller
            name="parent_id"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
                disabled={isLoading || parentTestCases.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent test case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {parentTestCases.map((testCase) => (
                    <SelectItem key={testCase.id} value={testCase.id}>
                      {testCase.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
    </div>
  );
};
