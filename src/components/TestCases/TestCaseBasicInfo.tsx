
import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TestCaseFormValues } from "./TestCaseFormTypes";

interface TestCaseBasicInfoProps {
  control: Control<TestCaseFormValues>;
  errors: FieldErrors<TestCaseFormValues>;
  isLoading: boolean;
}

export const TestCaseBasicInfo: React.FC<TestCaseBasicInfoProps> = ({
  control,
  errors,
  isLoading,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} id="title" placeholder="Enter test case title" disabled={isLoading} />
          )}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea {...field} id="description" placeholder="Enter test case description" disabled={isLoading} />
          )}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="preconditions">Preconditions</Label>
        <Controller
          name="preconditions"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea {...field} id="preconditions" placeholder="Enter preconditions" disabled={isLoading} />
          )}
        />
        {errors.preconditions && <p className="text-red-500 text-sm">{errors.preconditions.message}</p>}
      </div>
    </>
  );
};
